import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createApplication,
  getApplications,
  getApplicationDetail,
  approveApplication,
  rejectApplication,
  getApplicationStats
} from '../controllers/applicationController';
import { authenticate, requireProfessor } from '../middleware/auth';

const router = Router();

// Crear solicitud (público - desde landing o Google Forms)
router.post(
  '/',
  [
    body('nombre').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('telefono').optional(),
    body('pais').optional(),
    body('experiencia').optional(),
    body('interes').optional()
  ],
  createApplication
);

// Rutas del profesor
router.get('/', authenticate, requireProfessor, getApplications);
router.get('/stats', authenticate, requireProfessor, getApplicationStats);
router.get('/:id', authenticate, requireProfessor, [param('id').notEmpty()], getApplicationDetail);
router.post('/:id/approve', authenticate, requireProfessor, [param('id').notEmpty()], approveApplication);
router.post(
  '/:id/reject',
  authenticate,
  requireProfessor,
  [param('id').notEmpty(), body('motivo').optional()],
  rejectApplication
);

export default router;
