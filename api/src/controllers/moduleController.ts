import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Obtener todos los módulos (públicos para estudiantes)
export const getModules = asyncHandler(async (req: Request, res: Response) => {
  const { estado = 'publicado' } = req.query;

  const where: Prisma.ModuloWhereInput = {};

  if (req.user?.rol === 'estudiante') {
    where.OR = [
      { estado: 'publicado' },
      {
        estado: 'programado',
        fechaPublicacion: { lte: new Date() }
      }
    ];
  } else if (estado) {
    where.estado = estado as any;
  }

  const modulos = await prisma.modulo.findMany({
    where,
    orderBy: { orden: 'asc' }
  });

  res.json(modulos);
});

// Obtener un módulo por ID
export const getModuleById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const modulo = await prisma.modulo.findUnique({
    where: { id }
  });

  if (!modulo) {
    res.status(404).json({ error: 'Módulo no encontrado' });
    return;
  }

  if (req.user?.rol === 'estudiante') {
    const isPublished = modulo.estado === 'publicado';
    const isScheduledAndReady =
      modulo.estado === 'programado' &&
      modulo.fechaPublicacion !== null &&
      new Date(modulo.fechaPublicacion) <= new Date();

    if (!isPublished && !isScheduledAndReady) {
      res.status(403).json({ error: 'No tiene acceso a este módulo' });
      return;
    }
  }

  res.json(modulo);
});

// Obtener módulo por número de orden (para el frontend)
export const getModuleByOrder = asyncHandler(async (req: Request, res: Response) => {
  const { order } = req.params;
  const orderNum = parseInt(order, 10);

  if (isNaN(orderNum)) {
    res.status(400).json({ error: 'Número de módulo inválido' });
    return;
  }

  // FIX: usar AND para combinar orden con la condición de acceso del estudiante
  const where: Prisma.ModuloWhereInput =
    req.user?.rol === 'estudiante'
      ? {
          AND: [
            { orden: orderNum },
            {
              OR: [
                { estado: 'publicado' },
                {
                  estado: 'programado',
                  fechaPublicacion: { lte: new Date() }
                }
              ]
            }
          ]
        }
      : { orden: orderNum };

  const modulo = await prisma.modulo.findFirst({ where });

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
    contenido,
    duracion,
    objetivos,
    ejercicio,
    recursos,
    estado = 'borrador',
    fechaPublicacion
  } = req.body;

  if (!titulo) {
    res.status(400).json({ error: 'Título es requerido' });
    return;
  }

  let finalOrden = orden;
  if (finalOrden === undefined) {
    const lastModule = await prisma.modulo.findFirst({
      orderBy: { orden: 'desc' }
    });
    finalOrden = (lastModule?.orden ?? 0) + 1;
  }

  const modulo = await prisma.modulo.create({
    data: {
      titulo,
      descripcion,
      orden: finalOrden,
      moduloPrevioId,
      contenido: contenido ?? [],
      duracion: duracion ?? '2 semanas',
      objetivos: objetivos ?? [],
      ejercicio: ejercicio ?? {},
      recursos: recursos ?? [],
      estado,
      fechaPublicacion: fechaPublicacion ? new Date(fechaPublicacion) : null
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
    contenido,
    duracion,
    objetivos,
    ejercicio,
    recursos,
    estado,
    fechaPublicacion
  } = req.body;

  const existingModule = await prisma.modulo.findUnique({ where: { id } });

  if (!existingModule) {
    res.status(404).json({ error: 'Módulo no encontrado' });
    return;
  }

  // FIX: construir solo los campos presentes para evitar sobreescribir con undefined
  const data: Prisma.ModuloUpdateInput = {};
  if (titulo !== undefined)          data.titulo          = titulo;
  if (descripcion !== undefined)     data.descripcion     = descripcion;
  if (orden !== undefined)           data.orden           = orden;
  if (moduloPrevioId !== undefined)  data.moduloPrevioId  = moduloPrevioId;
  if (contenido !== undefined)       data.contenido       = contenido;
  if (duracion !== undefined)        data.duracion        = duracion;
  if (objetivos !== undefined)       data.objetivos       = objetivos;
  if (ejercicio !== undefined)       data.ejercicio       = ejercicio;
  if (recursos !== undefined)        data.recursos        = recursos;
  if (estado !== undefined)          data.estado          = estado;
  if (fechaPublicacion !== undefined) {
    data.fechaPublicacion = fechaPublicacion ? new Date(fechaPublicacion) : null;
  }

  const modulo = await prisma.modulo.update({ where: { id }, data });

  logger.info(`Módulo actualizado: ${id}`);

  res.json({
    message: 'Módulo actualizado exitosamente',
    modulo
  });
});

// Eliminar módulo (solo profesor)
export const deleteModule = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingModule = await prisma.modulo.findUnique({ where: { id } });

  if (!existingModule) {
    res.status(404).json({ error: 'Módulo no encontrado' });
    return;
  }

  const progresoCount = await prisma.progresoEstudiante.count({
    where: { moduloId: id }
  });

  if (progresoCount > 0) {
    res.status(400).json({
      error: 'No se puede eliminar el módulo porque tiene progreso de estudiantes asociado'
    });
    return;
  }

  await prisma.modulo.delete({ where: { id } });

  logger.info(`Módulo eliminado: ${id}`);

  res.json({ message: 'Módulo eliminado exitosamente' });
});

// Publicar módulo (solo profesor)
export const publishModule = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // FIX: verificar existencia antes de actualizar
  const existingModule = await prisma.modulo.findUnique({ where: { id } });

  if (!existingModule) {
    res.status(404).json({ error: 'Módulo no encontrado' });
    return;
  }

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

  const existingModule = await prisma.modulo.findUnique({ where: { id } });

  if (!existingModule) {
    res.status(404).json({ error: 'Módulo no encontrado' });
    return;
  }

  const lastModule = await prisma.modulo.findFirst({
    orderBy: { orden: 'desc' }
  });
  const newOrden = (lastModule?.orden ?? 0) + 1;

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

  // FIX: tipado explícito para evitar implicit any en el destructuring
  await prisma.$transaction(
    orders.map(({ id, orden }: { id: string; orden: number }) =>
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
    include: { progreso: true }
  });

  const stats = modulos.map(modulo => {
    const total = modulo.progreso.length;
    return {
      id: modulo.id,
      titulo: modulo.titulo,
      orden: modulo.orden,
      estado: modulo.estado,
      totalEstudiantes: total,
      completados: modulo.progreso.filter(p => p.completudPorcentaje === 100).length,
      enProgreso: modulo.progreso.filter(
        p => p.completudPorcentaje > 0 && p.completudPorcentaje < 100
      ).length,
      promedioCompletud:
        total > 0
          ? Math.round(
              modulo.progreso.reduce((acc, p) => acc + p.completudPorcentaje, 0) / total
            )
          : 0
    };
  });

  res.json(stats);
});