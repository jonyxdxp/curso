import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { sendRegistrationLinkEmail } from './emailService';

const prisma = new PrismaClient();

let stripe: Stripe | null = null;

export const initStripe = (): Stripe | null => {
  if (stripe) return stripe;
  
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    logger.warn('STRIPE_SECRET_KEY no configurado');
    return null;
  }
  
  stripe = new Stripe(secretKey, {
    apiVersion: '2023-10-16'
  });
  
  return stripe;
};

export const createCheckoutSession = async (
  estudianteId: string,
  email: string,
  nombre: string,
  monto: number,
  moneda: string = 'usd'
): Promise<{ sessionId: string; url: string } | null> => {
  try {
    const stripeInstance = initStripe();
    if (!stripeInstance) {
      throw new Error('Stripe no inicializado');
    }

    // Obtener o crear configuración del profesor para el precio
    const config = await prisma.configuracionProfesor.findFirst();
    const precio = config?.precioCurso?.toNumber() || monto;
    const currency = config?.moneda?.toLowerCase() || moneda;

    const session = await stripeInstance.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Poética de la Mirada - Curso Completo',
              description: 'Acceso completo al curso de arte online',
            },
            unit_amount: Math.round(precio * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pago-cancelado`,
      metadata: {
        estudianteId,
        email,
        nombre
      }
    });

    // Guardar referencia del pago pendiente
    await prisma.pago.create({
      data: {
        estudianteId,
        monto: precio,
        moneda: currency.toUpperCase(),
        proveedor: 'stripe',
        referenciaExterna: session.id,
        estado: 'pendiente'
      }
    });

    logger.info(`Sesión de pago creada: ${session.id} para ${email}`);
    
    return {
      sessionId: session.id,
      url: session.url || ''
    };
  } catch (error) {
    logger.error('Error creando sesión de pago:', error);
    return null;
  }
};

export const handleWebhook = async (payload: string, signature: string): Promise<boolean> => {
  try {
    const stripeInstance = initStripe();
    if (!stripeInstance) {
      throw new Error('Stripe no inicializado');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET no configurado');
    }

    const event = stripeInstance.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    logger.info(`Webhook recibido: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handlePaymentSuccess(session);
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handlePaymentExpired(session);
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }
    }

    return true;
  } catch (error) {
    logger.error('Error procesando webhook:', error);
    return false;
  }
};

const handlePaymentSuccess = async (session: Stripe.Checkout.Session) => {
  const { estudianteId, email, nombre } = session.metadata || {};
  
  if (!estudianteId) {
    logger.error('No se encontró estudianteId en metadata del webhook');
    return;
  }

  try {
    // Actualizar pago
    await prisma.pago.updateMany({
      where: { referenciaExterna: session.id },
      data: {
        estado: 'completado',
        fechaPago: new Date()
      }
    });

    // Actualizar estudiante
    await prisma.estudiante.update({
      where: { id: estudianteId },
      data: {
        estadoPago: 'pagado',
        fechaPago: new Date(),
        montoPagado: session.amount_total ? session.amount_total / 100 : 0,
        metodoPago: 'stripe',
        referenciaTransaccion: session.payment_intent as string || session.id,
        fechaInscripcion: new Date()
      }
    });

    // Crear usuario si no existe
    const estudiante = await prisma.estudiante.findUnique({
      where: { id: estudianteId },
      include: { user: true }
    });

    if (estudiante && !estudiante.user.password) {
      // Generar contraseña temporal y enviar email de bienvenida
      // Esto se maneja en el controlador de auth
      logger.info(`Pago completado para estudiante: ${estudianteId}`);

      // Enviar email con enlace de registro
      const registrationUrl = `${process.env.FRONTEND_URL}/register?estudianteId=${estudiante.id}&email=${estudiante.user.email}`;
      await sendRegistrationLinkEmail(estudiante.user.nombre, estudiante.user.email, registrationUrl);
    }

    logger.info(`Pago exitoso procesado: ${session.id}`);
  } catch (error) {
    logger.error('Error procesando pago exitoso:', error);
  }
};

const handlePaymentExpired = async (session: Stripe.Checkout.Session) => {
  try {
    await prisma.pago.updateMany({
      where: { referenciaExterna: session.id },
      data: { estado: 'fallido' }
    });
    logger.info(`Sesión expirada: ${session.id}`);
  } catch (error) {
    logger.error('Error procesando sesión expirada:', error);
  }
};

const handleRefund = async (charge: Stripe.Charge) => {
  try {
    await prisma.pago.updateMany({
      where: { referenciaExterna: charge.payment_intent as string },
      data: { estado: 'reembolsado' }
    });
    
    // Actualizar estado del estudiante
    const pago = await prisma.pago.findFirst({
      where: { referenciaExterna: charge.payment_intent as string }
    });
    
    if (pago) {
      await prisma.estudiante.update({
        where: { id: pago.estudianteId },
        data: { estadoPago: 'cancelado' }
      });
    }
    
    logger.info(`Reembolso procesado: ${charge.payment_intent}`);
  } catch (error) {
    logger.error('Error procesando reembolso:', error);
  }
};

export const getPaymentStatus = async (sessionId: string) => {
  try {
    const stripeInstance = initStripe();
    if (!stripeInstance) return null;

    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
    return session.payment_status;
  } catch (error) {
    logger.error('Error obteniendo estado de pago:', error);
    return null;
  }
};
