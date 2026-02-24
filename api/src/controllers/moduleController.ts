import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Obtener todos los módulos (públicos para estudiantes)
export const getModules = asyncHandler(async (req: Request, res: Response) => {
  const { estado = 'publicado' } = req.query;

  const where: any = {};
  
  // Si es estudiante, solo ver módulos publicados
  if (req.user?.rol === 'estudiante') {
    where.estado = 'publicado';
  } else if (estado) {
    where.estado = estado;
  }

  const modulos = await prisma.modulo.findMany({
    where,
    orderBy: { orden: 'asc' },
    include: {
      contenido: {
        orderBy: { orden: 'asc' }
      }
    }
  });

  res.json(modulos);
});

// Obtener un módulo por ID
export const getModuleById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const modulo = await prisma.modulo.findUnique({
    where: { id },
    include: {
      contenido: {
        orderBy: { orden: 'asc' }
      }
    }
  });

  if (!modulo) {
    res.status(404).json({ error: 'Módulo no encontrado' });
    return;
  }

  // Si es estudiante, verificar que el módulo esté publicado
  if (req.user?.rol === 'estudiante' && modulo.estado !== 'publicado') {
    res.status(403).json({ error: 'No tiene acceso a este módulo' });
    return;
  }

  res.json(modulo);
});

// Obtener módulo por número de orden (para el frontend)
export const getModuleByOrder = asyncHandler(async (req: Request, res: Response) => {
  const { order } = req.params;
  const orderNum = parseInt(order);

  if (isNaN(orderNum)) {
    res.status(400).json({ error: 'Número de módulo inválido' });
    return;
  }

  const modulo = await prisma.modulo.findFirst({
    where: { 
      orden: orderNum,
      estado: req.user?.rol === 'estudiante' ? 'publicado' : undefined
    }
  });

  if (!modulo) {
    res.status(404).json({ error: 'Módulo no encontrado' });
    return;
  }

  res.json(modulo);
});

// Crear módulo (solo profesor)
export const createModule = asyncHandler(async (req: Request, res: Response) => {
  const {
    titulo,
    descripcion,
    orden,
    moduloPrevioId,
    duracion,
    objetivos,
    ejercicio,
    recursos,
    estado = 'borrador'
  } = req.body;

  if (!titulo) {
    res.status(400).json({ error: 'Título es requerido' });
    return;
  }

  // Si no se especifica orden, ponerlo al final
  let finalOrden = orden;
  if (finalOrden === undefined) {
    const lastModule = await prisma.modulo.findFirst({
      orderBy: { orden: 'desc' }
    });
    finalOrden = (lastModule?.orden || 0) + 1;
  }

  const modulo = await prisma.modulo.create({
    data: {
      titulo,
      descripcion,
      orden: finalOrden,
      moduloPrevioId,
      duracion: duracion || '2 semanas',
      objetivos: objetivos || [],
      ejercicio: ejercicio || {},
      recursos: recursos || [],
      estado
    }
  });

  logger.info(`Módulo creado: ${modulo.id} - ${titulo}`);

  res.status(201).json({
    message: 'Módulo creado exitosamente',
    modulo
  });
});

// Actualizar módulo (solo profesor)
export const updateModule = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    titulo,
    descripcion,
    orden,
    moduloPrevioId,
    duracion,
    objetivos,
    ejercicio,
    recursos,
    estado
  } = req.body;

  const existingModule = await prisma.modulo.findUnique({
    where: { id }
  });

  if (!existingModule) {
    res.status(404).json({ error: 'Módulo no encontrado' });
    return;
  }

  const modulo = await prisma.modulo.update({
    where: { id },
    data: {
      titulo,
      descripcion,
      orden,
      moduloPrevioId,
      duracion,
      objetivos,
      ejercicio,
      recursos,
      estado
    }
  });

  logger.info(`Módulo actualizado: ${id}`);

  res.json({
    message: 'Módulo actualizado exitosamente',
    modulo
  });
});

// Eliminar módulo (solo profesor)
export const deleteModule = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingModule = await prisma.modulo.findUnique({
    where: { id }
  });

  if (!existingModule) {
    res.status(404).json({ error: 'Módulo no encontrado' });
    return;
  }

  // Verificar si hay progreso asociado
  const progresoCount = await prisma.progresoEstudiante.count({
    where: { moduloId: id }
  });

  if (progresoCount > 0) {
    res.status(400).json({ 
      error: 'No se puede eliminar el módulo porque tiene progreso de estudiantes asociado' 
    });
    return;
  }

  await prisma.modulo.delete({
    where: { id }
  });

  logger.info(`Módulo eliminado: ${id}`);

  res.json({ message: 'Módulo eliminado exitosamente' });
});

// Publicar módulo (solo profesor)
export const publishModule = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const modulo = await prisma.modulo.update({
    where: { id },
    data: { estado: 'publicado' }
  });

  logger.info(`Módulo publicado: ${id}`);

  res.json({
    message: 'Módulo publicado exitosamente',
    modulo
  });
});

// Duplicar módulo (solo profesor)
export const duplicateModule = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingModule = await prisma.modulo.findUnique({
    where: { id }
  });

  if (!existingModule) {
    res.status(404).json({ error: 'Módulo no encontrado' });
    return;
  }

  // Obtener el último orden
  const lastModule = await prisma.modulo.findFirst({
    orderBy: { orden: 'desc' }
  });
  const newOrden = (lastModule?.orden || 0) + 1;

  const newModule = await prisma.modulo.create({
    data: {
      titulo: `${existingModule.titulo} (Copia)`,
      descripcion: existingModule.descripcion,
      orden: newOrden,
      contenido: existingModule.contenido,
      duracion: existingModule.duracion,
      objetivos: existingModule.objetivos,
      ejercicio: existingModule.ejercicio,
      recursos: existingModule.recursos,
      estado: 'borrador'
    }
  });

  logger.info(`Módulo duplicado: ${id} -> ${newModule.id}`);

  res.status(201).json({
    message: 'Módulo duplicado exitosamente',
    modulo: newModule
  });
});

// Reordenar módulos (solo profesor)
export const reorderModules = asyncHandler(async (req: Request, res: Response) => {
  const { orders } = req.body; // [{ id, orden }]

  if (!Array.isArray(orders)) {
    res.status(400).json({ error: 'Formato inválido' });
    return;
  }

  await prisma.$transaction(
    orders.map(({ id, orden }) =>
      prisma.modulo.update({
        where: { id },
        data: { orden }
      })
    )
  );

  logger.info('Módulos reordenados');

  res.json({ message: 'Módulos reordenados exitosamente' });
});

// Estadísticas de módulos
export const getModuleStats = asyncHandler(async (req: Request, res: Response) => {
  const modulos = await prisma.modulo.findMany({
    include: {
      progreso: true
    }
  });

  const stats = modulos.map(modulo => ({
    id: modulo.id,
    titulo: modulo.titulo,
    orden: modulo.orden,
    estado: modulo.estado,
    totalEstudiantes: modulo.progreso.length,
    completados: modulo.progreso.filter(p => p.completudPorcentaje === 100).length,
    enProgreso: modulo.progreso.filter(p => p.completudPorcentaje > 0 && p.completudPorcentaje < 100).length,
    promedioCompletud: modulo.progreso.length > 0
      ? Math.round(modulo.progreso.reduce((acc, p) => acc + p.completudPorcentaje, 0) / modulo.progreso.length)
      : 0
  }));

  res.json(stats);
});
