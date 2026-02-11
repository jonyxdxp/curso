import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Dashboard del estudiante
export const getStudentDashboard = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const estudiante = await prisma.estudiante.findUnique({
    where: { userId },
    include: {
      user: true,
      progreso: {
        include: { modulo: true },
        orderBy: { modulo: { orden: 'asc' } }
      }
    }
  });

  if (!estudiante) {
    res.status(404).json({ error: 'Estudiante no encontrado' });
    return;
  }

  // Obtener todos los módulos publicados
  const modulos = await prisma.modulo.findMany({
    where: { estado: 'publicado' },
    orderBy: { orden: 'asc' }
  });

  // Calcular estadísticas
  const totalModulos = modulos.length;
  const modulosCompletados = estudiante.progreso.filter(p => p.completudPorcentaje === 100).length;
  const progresoGeneral = totalModulos > 0 ? Math.round((modulosCompletados / totalModulos) * 100) : 0;

  // Mapear módulos con su progreso
  const modulosConProgreso = modulos.map(modulo => {
    const progreso = estudiante.progreso.find(p => p.moduloId === modulo.id);
    return {
      id: modulo.id,
      titulo: modulo.titulo,
      descripcion: modulo.descripcion,
      orden: modulo.orden,
      duracion: modulo.duracion,
      badge: `MÓDULO 0${modulo.orden}`,
      progreso: progreso?.completudPorcentaje || 0,
      estado: progreso?.completudPorcentaje === 100 ? 'completado' : 
              progreso?.completudPorcentaje && progreso.completudPorcentaje > 0 ? 'en_progreso' : 'no_iniciado',
      fechaCompletado: progreso?.fechaCompletado,
      image: `/images/module0${modulo.orden}_bg.jpg`
    };
  });

  // Encontrar el siguiente módulo a completar
  const siguienteModulo = modulosConProgreso.find(m => m.estado !== 'completado');

  // Obtener recursos de todos los módulos
  const recursos = modulos.flatMap(m => 
    (m.recursos as any[] || []).map(r => ({
      ...r,
      modulo: m.titulo
    }))
  );

  res.json({
    perfil: {
      id: estudiante.id,
      nombre: estudiante.user.nombre,
      email: estudiante.user.email,
      avatarUrl: estudiante.user.avatarUrl,
      fechaInscripcion: estudiante.fechaInscripcion
    },
    estadisticas: {
      progresoGeneral,
      totalModulos,
      modulosCompletados,
      modulosEnProgreso: modulosConProgreso.filter(m => m.estado === 'en_progreso').length,
      modulosNoIniciados: modulosConProgreso.filter(m => m.estado === 'no_iniciado').length
    },
    modulos: modulosConProgreso,
    siguienteModulo,
    recursos: recursos.slice(0, 10), // Últimos 10 recursos
    mensajeBienvenida: {
      titulo: `¡Hola ${estudiante.user.nombre}!`,
      mensaje: 'Bienvenido a Poética de la Mirada. Estamos emocionados de acompañarte en este viaje artístico.',
      imagenProfesor: '/images/instructor.jpg'
    }
  });
});

// Dashboard del profesor
export const getProfessorDashboard = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const profesor = await prisma.profesor.findFirst({
    where: { userId },
    include: { configuracion: true }
  });

  if (!profesor) {
    res.status(403).json({ error: 'No autorizado' });
    return;
  }

  // Estadísticas principales
  const [
    totalEstudiantes,
    estudiantesPagados,
    estudiantesPendientes,
    solicitudesPendientes,
    totalModulos,
    modulosPublicados
  ] = await Promise.all([
    prisma.estudiante.count(),
    prisma.estudiante.count({ where: { estadoPago: 'pagado' } }),
    prisma.estudiante.count({ where: { estadoPago: 'no_pagado', estadoAprobacion: 'aprobado' } }),
    prisma.solicitudAcceso.count({ where: { estado: 'pendiente' } }),
    prisma.modulo.count(),
    prisma.modulo.count({ where: { estado: 'publicado' } })
  ]);

  // Ingresos
  const ingresos = await prisma.pago.aggregate({
    where: { estado: 'completado' },
    _sum: { monto: true }
  });

  // Estudiantes recientes
  const estudiantesRecientes = await prisma.estudiante.findMany({
    take: 5,
    orderBy: { fechaInscripcion: 'desc' },
    include: {
      user: {
        select: { nombre: true, email: true, avatarUrl: true }
      }
    }
  });

  // Solicitudes recientes
  const solicitudesRecientes = await prisma.solicitudAcceso.findMany({
    take: 5,
    where: { estado: 'pendiente' },
    orderBy: { fechaSolicitud: 'desc' }
  });

  // Progreso promedio por módulo
  const progresoPorModulo = await prisma.modulo.findMany({
    where: { estado: 'publicado' },
    include: {
      progreso: true
    },
    orderBy: { orden: 'asc' }
  });

  const modulosStats = progresoPorModulo.map(m => ({
    id: m.id,
    titulo: m.titulo,
    orden: m.orden,
    promedioCompletud: m.progreso.length > 0
      ? Math.round(m.progreso.reduce((acc, p) => acc + p.completudPorcentaje, 0) / m.progreso.length)
      : 0,
    estudiantesActivos: m.progreso.filter(p => p.completudPorcentaje > 0).length
  }));

  res.json({
    estadisticas: {
      totalEstudiantes,
      estudiantesPagados,
      estudiantesPendientes,
      solicitudesPendientes,
      totalModulos,
      modulosPublicados,
      ingresosTotales: ingresos._sum.monto || 0
    },
    estudiantesRecientes: estudiantesRecientes.map(e => ({
      id: e.id,
      nombre: e.user.nombre,
      email: e.user.email,
      avatarUrl: e.user.avatarUrl,
      estadoPago: e.estadoPago,
      fechaInscripcion: e.fechaInscripcion
    })),
    solicitudesRecientes,
    progresoPorModulo: modulosStats,
    configuracion: profesor.configuracion
  });
});

// Actividad reciente
export const getRecentActivity = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  // Últimas acciones (últimas 24 horas)
  const unDiaAtras = new Date();
  unDiaAtras.setDate(unDiaAtras.getDate() - 1);

  const [nuevosEstudiantes, nuevosPagos, nuevasSolicitudes, progresosActualizados] = await Promise.all([
    prisma.estudiante.count({
      where: { fechaInscripcion: { gte: unDiaAtras } }
    }),
    prisma.pago.count({
      where: { fechaPago: { gte: unDiaAtras } }
    }),
    prisma.solicitudAcceso.count({
      where: { fechaSolicitud: { gte: unDiaAtras } }
    }),
    prisma.progresoEstudiante.count({
      where: { ultimaActividad: { gte: unDiaAtras } }
    })
  ]);

  res.json({
    ultimas24Horas: {
      nuevosEstudiantes,
      nuevosPagos,
      nuevasSolicitudes,
      progresosActualizados
    }
  });
});
