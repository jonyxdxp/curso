import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  };

  return nodemailer.createTransport(config);
};

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"Poética de la Mirada" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });

    logger.info(`Email enviado a ${to}: ${subject}`);
    return true;
  } catch (error) {
    logger.error('Error enviando email:', error);
    return false;
  }
};

// Templates de email
export const emailTemplates = {
  welcome: (nombre: string, loginUrl: string) => ({
    subject: '¡Bienvenido a Poética de la Mirada!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #C7A36D;">¡Hola ${nombre}!</h1>
        <p>Tu pago ha sido confirmado y ahora tienes acceso completo al curso <strong>Poética de la Mirada</strong>.</p>
        <p>Para comenzar, inicia sesión en tu cuenta:</p>
        <a href="${loginUrl}" style="display: inline-block; background: #C7A36D; color: #0B0B0D; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Acceder al Curso
        </a>
        <p>¡Nos vemos en clase!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #666; font-size: 12px;">
          Poética de la Mirada - Curso de Arte Online
        </p>
      </div>
    `
  }),

  paymentApproved: (nombre: string, paymentUrl: string, monto: number, moneda: string) => ({
    subject: '¡Solicitud Aprobada! Completa tu inscripción',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #C7A36D;">¡Felicidades ${nombre}!</h1>
        <p>Tu solicitud para el curso <strong>Poética de la Mirada</strong> ha sido aprobada.</p>
        <p>Para completar tu inscripción, realiza el pago de <strong>${moneda} ${monto}</strong>:</p>
        <a href="${paymentUrl}" style="display: inline-block; background: #C7A36D; color: #0B0B0D; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Realizar Pago
        </a>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #666; font-size: 12px;">
          Poética de la Mirada - Curso de Arte Online
        </p>
      </div>
    `
  }),

  applicationRejected: (nombre: string, motivo?: string) => ({
    subject: 'Actualización sobre tu solicitud',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #C7A36D;">Hola ${nombre}</h1>
        <p>Hemos revisado tu solicitud para el curso <strong>Poética de la Mirada</strong>.</p>
        <p>En esta ocasión, no podemos aprobar tu solicitud.</p>
        ${motivo ? `<p><strong>Motivo:</strong> ${motivo}</p>` : ''}
        <p>Puedes intentar solicitar acceso nuevamente en el futuro.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #666; font-size: 12px;">
          Poética de la Mirada - Curso de Arte Online
        </p>
      </div>
    `
  }),

  newApplication: (nombre: string, email: string) => ({
    subject: 'Nueva solicitud de acceso',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #C7A36D;">Nueva Solicitud de Acceso</h1>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>Revisa el dashboard para aprobar o rechazar esta solicitud.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #666; font-size: 12px;">
          Poética de la Mirada - Sistema Automático
        </p>
      </div>
    `
  }),

  passwordReset: (nombre: string, resetUrl: string) => ({
    subject: 'Restablecer contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #C7A36D;">Restablecer Contraseña</h1>
        <p>Hola ${nombre},</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #C7A36D; color: #0B0B0D; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Restablecer Contraseña
        </a>
        <p>Este enlace expirará en 1 hora.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #666; font-size: 12px;">
          Poética de la Mirada - Curso de Arte Online
        </p>
      </div>
    `
  })
};

export const sendWelcomeEmail = async (nombre: string, email: string, loginUrl: string) => {
  const template = emailTemplates.welcome(nombre, loginUrl);
  return sendEmail(email, template.subject, template.html);
};

export const sendPaymentApprovedEmail = async (
  nombre: string, 
  email: string, 
  paymentUrl: string,
  monto: number,
  moneda: string
) => {
  const template = emailTemplates.paymentApproved(nombre, paymentUrl, monto, moneda);
  return sendEmail(email, template.subject, template.html);
};

export const sendApplicationRejectedEmail = async (nombre: string, email: string, motivo?: string) => {
  const template = emailTemplates.applicationRejected(nombre, motivo);
  return sendEmail(email, template.subject, template.html);
};

export const sendNewApplicationNotification = async (profesorEmail: string, nombre: string, email: string) => {
  const template = emailTemplates.newApplication(nombre, email);
  return sendEmail(profesorEmail, template.subject, template.html);
};
