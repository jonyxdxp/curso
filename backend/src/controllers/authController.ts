import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// Generar tokens
const generateTokens = (userId: string, email: string, rol: string) => {
  const accessToken = jwt.sign(
    { userId, email, rol },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

// Login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email y contraseña son requeridos' });
    return;
  }

  // Buscar usuario
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      estudiante: true,
      profesor: true
    }
  });

  if (!user) {
    res.status(401).json({ error: 'Credenciales inválidas' });
    return;
  }

  // Verificar contraseña
  if (!user.password) {
    res.status(401).json({ error: 'Usuario no tiene contraseña configurada' });
    return;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    res.status(401).json({ error: 'Credenciales inválidas' });
    return;
  }

  // Verificar estado
  if (user.estado === 'inactivo') {
    res.status(401).json({ error: 'Usuario inactivo' });
    return;
  }

  // Para estudiantes, verificar que hayan pagado
  if (user.rol === 'estudiante' && user.estudiante) {
    if (user.estudiante.estadoPago !== 'pagado') {
      res.status(403).json({ 
        error: 'Pago requerido',
        message: 'Debes completar el pago para acceder al curso'
      });
      return;
    }
  }

  // Actualizar último login del profesor
  if (user.rol === 'profesor' && user.profesor) {
    await prisma.profesor.update({
      where: { id: user.profesor.id },
      data: { ultimoLogin: new Date() }
    });
  }

  // Generar tokens
  const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.rol);

  logger.info(`Login exitoso: ${email}`);

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      avatarUrl: user.avatarUrl,
      estudiante: user.estudiante ? {
        id: user.estudiante.id,
        estadoPago: user.estudiante.estadoPago,
        estadoAprobacion: user.estudiante.estadoAprobacion
      } : null,
      profesor: user.profesor ? {
        id: user.profesor.id
      } : null
    }
  });
});

// Registro (solo para estudiantes que ya fueron aprobados y pagaron)
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, nombre, estudianteId } = req.body;

  if (!email || !password || !nombre || !estudianteId) {
    res.status(400).json({ error: 'Todos los campos son requeridos' });
    return;
  }

  // Verificar que el estudiante existe y está aprobado y pagado
  const estudiante = await prisma.estudiante.findUnique({
    where: { id: estudianteId },
    include: { user: true }
  });

  if (!estudiante) {
    res.status(404).json({ error: 'Estudiante no encontrado' });
    return;
  }

  if (estudiante.estadoAprobacion !== 'aprobado') {
    res.status(403).json({ error: 'Solicitud no aprobada' });
    return;
  }

  if (estudiante.estadoPago !== 'pagado') {
    res.status(403).json({ error: 'Pago no completado' });
    return;
  }

  // Verificar que el email coincida
  if (estudiante.user.email !== email) {
    res.status(400).json({ error: 'Email no coincide con el registrado' });
    return;
  }

  // Verificar que no tenga contraseña ya
  if (estudiante.user.password) {
    res.status(400).json({ error: 'Usuario ya tiene contraseña configurada' });
    return;
  }

  // Hash de contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Actualizar usuario
  const updatedUser = await prisma.user.update({
    where: { id: estudiante.userId },
    data: {
      password: hashedPassword,
      nombre
    },
    include: { estudiante: true }
  });

  // Generar tokens
  const { accessToken, refreshToken } = generateTokens(
    updatedUser.id, 
    updatedUser.email, 
    updatedUser.rol
  );

  logger.info(`Registro completado: ${email}`);

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      nombre: updatedUser.nombre,
      rol: updatedUser.rol,
      avatarUrl: updatedUser.avatarUrl,
      estudiante: {
        id: estudiante.id,
        estadoPago: estudiante.estadoPago,
        estadoAprobacion: estudiante.estadoAprobacion
      }
    }
  });
});

// Refresh token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ error: 'Refresh token requerido' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string; type: string };

    if (decoded.type !== 'refresh') {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.estado === 'inactivo') {
      res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
      return;
    }

    const tokens = generateTokens(user.id, user.email, user.rol);

    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

// Obtener perfil del usuario actual
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      estudiante: {
        include: {
          progreso: {
            include: { modulo: true }
          }
        }
      },
      profesor: true
    }
  });

  if (!user) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }

  res.json({
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    rol: user.rol,
    avatarUrl: user.avatarUrl,
    estudiante: user.estudiante ? {
      id: user.estudiante.id,
      estadoPago: user.estudiante.estadoPago,
      estadoAprobacion: user.estudiante.estadoAprobacion,
      fechaPago: user.estudiante.fechaPago,
      fechaInscripcion: user.estudiante.fechaInscripcion,
      progreso: user.estudiante.progreso
    } : null,
    profesor: user.profesor ? {
      id: user.profesor.id
    } : null
  });
});

// Actualizar perfil
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { nombre, avatarUrl } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      nombre,
      avatarUrl
    }
  });

  res.json({
    id: updatedUser.id,
    email: updatedUser.email,
    nombre: updatedUser.nombre,
    avatarUrl: updatedUser.avatarUrl
  });
});

// Cambiar contraseña
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'No autenticado' });
    return;
  }

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user || !user.password) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.password);

  if (!isValidPassword) {
    res.status(401).json({ error: 'Contraseña actual incorrecta' });
    return;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  logger.info(`Contraseña cambiada: ${user.email}`);

  res.json({ message: 'Contraseña actualizada exitosamente' });
});
