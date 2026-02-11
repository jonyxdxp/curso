import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
  email: string;
  rol: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token no proporcionado' });
      return;
    }

    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no configurado');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    
    // Verificar que el usuario existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, estado: true }
    });

    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado' });
      return;
    }

    if (user.estado === 'inactivo') {
      res.status(401).json({ error: 'Usuario inactivo' });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expirado' });
      return;
    }
    res.status(500).json({ error: 'Error en autenticación' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    if (!roles.includes(req.user.rol)) {
      res.status(403).json({ error: 'No tiene permisos para esta acción' });
      return;
    }

    next();
  };
};

export const requireProfessor = requireRole(['profesor']);
export const requireStudent = requireRole(['estudiante']);
