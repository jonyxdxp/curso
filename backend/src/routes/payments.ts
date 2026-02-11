import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createPaymentSession,
  checkPaymentStatus,
  getMyPayments,
  getAllPayments,
  getPaymentStats,
  processRefund,
  setCoursePrice,
  getCoursePrice
} from '../controllers/paymentController';
import { authenticate, requireProfessor, requireStudent } from '../middleware/auth';

const router = Router();

// Rutas del estudiante
router.post('/create-session', authenticate, requireStudent, createPaymentSession);
router.get('/my-payments', authenticate, requireStudent, getMyPayments);
router.get('/status/:sessionId', authenticate, [param('sessionId').notEmpty()], checkPaymentStatus);

// Rutas públicas
router.get('/price', getCoursePrice);

// Rutas del profesor
router.get('/', authenticate, requireProfessor, getAllPayments);
router.get('/stats', authenticate, requireProfessor, getPaymentStats);
router.post('/refund/:id', authenticate, requireProfessor, [param('id').notEmpty()], processRefund);
router.post(
  '/price',
  authenticate,
  requireProfessor,
  [body('precio').isFloat({ min: 0 }), body('moneda').optional()],
  setCoursePrice
);

export default router;
