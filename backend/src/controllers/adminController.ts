import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Obtener resumen del dashboard
export const getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
  const [
    totalEstudiantes,
    estudiantesActivos,
    estudiantesPagados,
    estudiantesPendientes,
    solicitudesPendientes,
    totalModulos,
    modulosPublicados
  ] = await Promise.all([
    prisma.estudiante.count(),
    prisma.estudiante.count({
      where: {
        user: { estado: 'activo' }
      }
    }),
    prisma.estudiante.count({ where: { estadoPago: 'pagado' } }),
    prisma.estudiante.count({ where: { estadoPago: 'no_pagado', estadoAprobacion: 'aprobado' } }),
    prisma.solicitudAcceso.count({ where: { estado: 'pendiente' } }),
    prisma.modulo.count(),
    prisma.modulo.count({ where: { estado: 'publicado' } })
  ]);

  // Ingresos totales
  const ingresos = await prisma.pago.aggregate({
    where: { estado: 'completado' },
    _sum: { monto: true }
  });

  // Estudiantes nuevos esta semana
  const unaSemanaAtras = new Date();
  unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);

  const estudiantesNuevos = await prisma.estudiante.count({
    where: {
      fechaInscripcion: {
        gte: unaSemanaAtras
      }
    }
  });

  res.json({
    estudiantes: {
      total: totalEstudiantes,
      activos: estudiantesActivos,
      pagados: estudiantesPagados,
      pendientesPago: estudiantesPendientes,
      nuevosEstaSemana: estudiantesNuevos
    },
    solicitudes: {
      pendientes: solicitudesPendientes
    },
    modulos: {
      total: totalModulos,
      publicados: modulosPublicados
    },
    finanzas: {
      ingresosTotales: ingresos._sum.monto || 0
    }
  });
});

// Obtener configuración del profesor
export const getConfig = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const profesor = await prisma.profesor.findFirst({
    where: { userId },
    include: { configuracion: true }
  });

  if (!profesor) {
    res.status(404).json({ error: 'Profesor no encontrado' });
    return;
  }

  res.json({
    profesorId: profesor.id,
    configuracion: profesor.configuracion || {
      nombreCurso: 'Poética de la Mirada',
      descripcionCurso: '',
      precioCurso: 100,
      moneda: 'USD',
      bioProfesor: '',
      emailContacto: '',
      whatsappNumero: '',
      notificarEmail: true,
      notificarWhatsApp: false
    }
  });
});

// Actualizar configuración del profesor
export const updateConfig = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const {
    nombreCurso,
    descripcionCurso,
    precioCurso,
    moneda,
    bioProfesor,
    fotoProfesorUrl,
    emailContacto,
    whatsappNumero,
    pais,
    notificarEmail,
    notificarWhatsApp
  } = req.body;

  const profesor = await prisma.profesor.findFirst({
    where: { userId }
  });

  if (!profesor) {
    res.status(404).json({ error: 'Profesor no encontrado' });
    return;
  }

  const config = await prisma.configuracionProfesor.upsert({
    where: { profesorId: profesor.id },
    update: {
      nombreCurso,
      descripcionCurso,
      precioCurso,
      moneda,
      bioProfesor,
      fotoProfesorUrl,
      emailContacto,
      whatsappNumero,
      pais,
      notificarEmail,
      notificarWhatsApp
    },
    create: {
      profesorId: profesor.id,
      nombreCurso: nombreCurso || 'Poética de la Mirada',
      precioCurso: precioCurso || 100,
      moneda: moneda || 'USD',
      descripcionCurso,
      bioProfesor,
      fotoProfesorUrl,
      emailContacto,
      whatsappNumero,
      pais,
      notificarEmail: notificarEmail ?? true,
      notificarWhatsApp: notificarWhatsApp ?? false
    }
  });

  logger.info(`Configuración actualizada por profesor: ${profesor.id}`);

  res.json({
    message: 'Configuración actualizada exitosamente',
    config
  });
});

// Configurar claves de Stripe
export const setStripeKeys = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { stripeSecretKey, stripePublicKey, stripeWebhookSecret } = req.body;

  const profesor = await prisma.profesor.findFirst({
    where: { userId }
  });

  if (!profesor) {
    res.status(404).json({ error: 'Profesor no encontrado' });
    return;
  }

  const config = await prisma.configuracionProfesor.upsert({
    where: { profesorId: profesor.id },
    update: {
      stripeSecretKey,
      stripePublicKey,
      stripeWebhookSecret
    },
    create: {
      profesorId: profesor.id,
      nombreCurso: 'Poética de la Mirada',
      precioCurso: 100,
      moneda: 'USD',
      stripeSecretKey,
      stripePublicKey,
      stripeWebhookSecret
    }
  });

  logger.info(`Claves de Stripe actualizadas por profesor: ${profesor.id}`);

  res.json({
    message: 'Claves de Stripe actualizadas exitosamente',
    config: {
      stripePublicKey: config.stripePublicKey
    }
  });
});

// Estadísticas detalladas
export const getDetailedStats = asyncHandler(async (req: Request, res: Response) => {
  // Estudiantes por mes (últimos 6 meses)
  const seisMesesAtras = new Date();
  seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

  const estudiantesPorMes = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', "fechaInscripcion") as mes,
      COUNT(*) as total
    FROM estudiantes
    WHERE "fechaInscripcion" >= ${seisMesesAtras}
    GROUP BY DATE_TRUNC('month', "fechaInscripcion")
    ORDER BY mes ASC
  `;

  // Pagos por mes
  const pagosPorMes = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', "fechaPago") as mes,
      SUM(monto) as total,
      COUNT(*) as cantidad
    FROM pagos
    WHERE "fechaPago" >= ${seisMesesAtras}
      AND estado = 'completado'
    GROUP BY DATE_TRUNC('month', "fechaPago")
    ORDER BY mes ASC
  `;

  // Progreso promedio por módulo
  const progresoPorModulo = await prisma.modulo.findMany({
    where: { estado: 'publicado' },
    include: {
      progreso: true
    },
    orderBy: { orden: 'asc' }
  });

  const progresoStats = progresoPorModulo.map(m => ({
    moduloId: m.id,
    titulo: m.titulo,
    orden: m.orden,
    promedioCompletud: m.progreso.length > 0
      ? Math.round(m.progreso.reduce((acc, p) => acc + p.completudPorcentaje, 0) / m.progreso.length)
      : 0,
    totalEstudiantes: m.progreso.length,
    completados: m.progreso.filter(p => p.completudPorcentaje === 100).length
  }));

  // Tasas de conversión
  const [totalSolicitudes, aprobadas, pagadas] = await Promise.all([
    prisma.solicitudAcceso.count(),
    prisma.solicitudAcceso.count({ where: { estado: 'aprobado' } }),
    prisma.estudiante.count({ where: { estadoPago: 'pagado' } })
  ]);

  res.json({
    estudiantesPorMes,
    pagosPorMes,
    progresoPorModulo: progresoStats,
    tasas: {
      aprobacion: totalSolicitudes > 0 ? Math.round((aprobadas / totalSolicitudes) * 100) : 0,
      conversion: aprobadas > 0 ? Math.round((pagadas / aprobadas) * 100) : 0
    }
  });
});

// Crear profesor inicial (para setup)
export const createInitialProfessor = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, nombre } = req.body;

  // Verificar si ya existe un profesor
  const existingProfessor = await prisma.profesor.findFirst();

  if (existingProfessor) {
    res.status(400).json({ error: 'Ya existe un profesor configurado' });
    return;
  }

  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nombre,
      rol: 'profesor',
      estado: 'activo',
      profesor: {
        create: {
          permisos: ['*']
        }
      }
    },
    include: { profesor: true }
  });

  logger.info(`Profesor inicial creado: ${email}`);

  res.status(201).json({
    message: 'Profesor creado exitosamente',
    user: {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      profesorId: user.profesor?.id
    }
  });
});
