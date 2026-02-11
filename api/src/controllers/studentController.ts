import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Obtener progreso del estudiante actual
export const getMyProgress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const estudiante = await prisma.estudiante.findUnique({
    where: { userId },
    include: {
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

  // Calcular progreso general
  const totalModulos = await prisma.modulo.count({ where: { estado: 'publicado' } });
  const modulosCompletados = estudiante.progreso.filter(p => p.completudPorcentaje === 100).length;
  const progresoGeneral = totalModulos > 0 ? Math.round((modulosCompletados / totalModulos) * 100) : 0;

  res.json({
    estudianteId: estudiante.id,
    progresoGeneral,
    totalModulos,
    modulosCompletados,
    modulosEnProgreso: estudiante.progreso.filter(p => p.completudPorcentaje > 0 && p.completudPorcentaje < 100).length,
    progresoDetalle: estudiante.progreso.map(p => ({
      moduloId: p.moduloId,
      titulo: p.modulo.titulo,
      orden: p.modulo.orden,
      completudPorcentaje: p.completudPorcentaje,
      fechaCompletado: p.fechaCompletado,
      ultimaActividad: p.ultimaActividad
    }))
  });
});

// Actualizar progreso de un módulo
export const updateProgress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { moduloId } = req.params;
  const { completudPorcentaje } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  if (completudPorcentaje === undefined || completudPorcentaje < 0 || completudPorcentaje > 100) {
    res.status(400).json({ error: 'Porcentaje de completitud inválido' });
    return;
  }

  const estudiante = await prisma.estudiante.findUnique({
    where: { userId }
  });

  if (!estudiante) {
    res.status(404).json({ error: 'Estudiante no encontrado' });
    return;
  }

  // Verificar que el módulo existe
  const modulo = await prisma.modulo.findUnique({
    where: { id: moduloId }
  });

  if (!modulo) {
    res.status(404).json({ error: 'Módulo no encontrado' });
    return;
  }

  const fechaCompletado = completudPorcentaje === 100 ? new Date() : undefined;

  const progreso = await prisma.progresoEstudiante.upsert({
    where: {
      estudianteId_moduloId: {
        estudianteId: estudiante.id,
        moduloId
      }
    },
    update: {
      completudPorcentaje,
      fechaCompletado,
      ultimaActividad: new Date()
    },
    create: {
      estudianteId: estudiante.id,
      moduloId,
      completudPorcentaje,
      fechaCompletado,
      ultimaActividad: new Date()
    }
  });

  logger.info(`Progreso actualizado: ${estudiante.id} - Módulo ${moduloId}: ${completudPorcentaje}%`);

  res.json(progreso);
});

// Marcar módulo como completado
export const markModuleComplete = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { moduloId } = req.params;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const estudiante = await prisma.estudiante.findUnique({
    where: { userId }
  });

  if (!estudiante) {
    res.status(404).json({ error: 'Estudiante no encontrado' });
    return;
  }

  const progreso = await prisma.progresoEstudiante.upsert({
    where: {
      estudianteId_moduloId: {
        estudianteId: estudiante.id,
        moduloId
      }
    },
    update: {
      completudPorcentaje: 100,
      fechaCompletado: new Date(),
      ultimaActividad: new Date()
    },
    create: {
      estudianteId: estudiante.id,
      moduloId,
      completudPorcentaje: 100,
      fechaCompletado: new Date(),
      ultimaActividad: new Date()
    }
  });

  logger.info(`Módulo completado: ${estudiante.id} - ${moduloId}`);

  res.json({
    message: 'Módulo marcado como completado',
    progreso
  });
});

// Obtener dashboard del estudiante
export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
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
      progreso: progreso?.completudPorcentaje || 0,
      estado: progreso?.completudPorcentaje === 100 ? 'completado' : 
              progreso?.completudPorcentaje && progreso.completudPorcentaje > 0 ? 'en_progreso' : 'no_iniciado',
      fechaCompletado: progreso?.fechaCompletado
    };
  });

  res.json({
    estudiante: {
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
    siguienteModulo: modulosConProgreso.find(m => m.estado !== 'completado') || null
  });
});

// Obtener lista de estudiantes (solo profesor)
export const getStudents = asyncHandler(async (req: Request, res: Response) => {
  const { estado, search, page = '1', limit = '20' } = req.query;

  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 20;
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};

  if (estado) {
    where.estadoPago = estado;
  }

  if (search) {
    where.OR = [
      { user: { nombre: { contains: search as string, mode: 'insensitive' } } },
      { user: { email: { contains: search as string, mode: 'insensitive' } } }
    ];
  }

  const [estudiantes, total] = await Promise.all([
  prisma.estudiante.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          nombre: true,
          email: true,
          avatarUrl: true,
          estado: true
        }
      },
      progreso: {
        select: {
          completudPorcentaje: true
        }
      }
    },
    skip,
    take: limitNum,
    orderBy: { fechaInscripcion: 'desc' }  // Changed from createdAt
  }),
  prisma.estudiante.count({ where })
]);

  const estudiantesFormateados = estudiantes.map(e => ({
    id: e.id,
    userId: e.userId,
    nombre: e.user.nombre,
    email: e.user.email,
    avatarUrl: e.user.avatarUrl,
    estado: e.user.estado,
    estadoPago: e.estadoPago,
    estadoAprobacion: e.estadoAprobacion,
    fechaPago: e.fechaPago,
    fechaInscripcion: e.fechaInscripcion,
    progresoPromedio: e.progreso.length > 0 
      ? Math.round(e.progreso.reduce((acc, p) => acc + p.completudPorcentaje, 0) / e.progreso.length)
      : 0
  }));

  res.json({
    estudiantes: estudiantesFormateados,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  });
});

// Obtener detalle de un estudiante (solo profesor)
export const getStudentDetail = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const estudiante = await prisma.estudiante.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          nombre: true,
          email: true,
          avatarUrl: true,
          estado: true,
          createdAt: true
        }
      },
      progreso: {
        include: { modulo: true },
        orderBy: { modulo: { orden: 'asc' } }
      },
      pagos: true
    }
  });

  if (!estudiante) {
    res.status(404).json({ error: 'Estudiante no encontrado' });
    return;
  }

  res.json({
    id: estudiante.id,
    userId: estudiante.userId,
    nombre: estudiante.user.nombre,
    email: estudiante.user.email,
    avatarUrl: estudiante.user.avatarUrl,
    estado: estudiante.user.estado,
    estadoPago: estudiante.estadoPago,
    estadoAprobacion: estudiante.estadoAprobacion,
    fechaAprobacion: estudiante.fechaAprobacion,
    fechaPago: estudiante.fechaPago,
    fechaInscripcion: estudiante.fechaInscripcion,
    montoPagado: estudiante.montoPagado,
    metodoPago: estudiante.metodoPago,
    telefono: estudiante.telefono,
    pais: estudiante.pais,
    experiencia: estudiante.experiencia,
    interes: estudiante.interes,
    fechaRegistro: estudiante.user.createdAt,
    progreso: estudiante.progreso.map(p => ({
      moduloId: p.moduloId,
      titulo: p.modulo.titulo,
      orden: p.modulo.orden,
      completudPorcentaje: p.completudPorcentaje,
      fechaCompletado: p.fechaCompletado,
      ultimaActividad: p.ultimaActividad
    })),
    pagos: estudiante.pagos
  });
});
