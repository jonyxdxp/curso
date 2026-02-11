import { Request, Response } from 'express';
import { handleWebhook } from '../services/paymentService';
import { logger } from '../utils/logger';

// Webhook de Stripe
export const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  if (!signature) {
    res.status(400).json({ error: 'Firma no proporcionada' });
    return;
  }

  try {
    const success = await handleWebhook(req.body, signature);

    if (success) {
      res.json({ received: true });
    } else {
      res.status(400).json({ error: 'Error procesando webhook' });
    }
  } catch (error) {
    logger.error('Error en webhook de Stripe:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
};

// Webhook para Google Forms
// Webhook para Google Forms
export const googleFormsWebhook = async (req: Request, res: Response) => {
  const { nombre, email, telefono, pais, experiencia, interes } = req.body;

  try {
    // Importar dinámicamente para evitar dependencias circulares
    const { createApplication } = await import('./applicationController');
    
    // Crear solicitud
    await createApplication(
      { body: { nombre, email, telefono, pais, experiencia, interes } } as Request,
      {
        status: (code: number) => ({
          json: (data: any) => {
            if (code >= 400) {
              logger.error(`Error creando solicitud desde Google Forms: ${data.error}`);
            } else {
              logger.info(`Solicitud creada desde Google Forms: ${email}`);
            }
          }
        })
      } as any,
      () => {}  // Add empty next function
    );

    res.json({ success: true });
  } catch (error) {
    logger.error('Error procesando webhook de Google Forms:', error);
    res.status(500).json({ error: 'Error procesando solicitud' });
  }
};

// Health check para webhooks
export const webhookHealth = (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    webhooks: ['stripe', 'google-forms']
  });
};
