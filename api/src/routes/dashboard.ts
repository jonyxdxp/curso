import { Router } from 'express';
import {
  getStudentDashboard,
  getProfessorDashboard,
  getRecentActivity
} from '../controllers/dashboardController';
import { authenticate, requireProfessor, requireStudent } from '../middleware/auth';

const router = Router();

// Dashboard del estudiante
router.get('/student', authenticate, requireStudent, getStudentDashboard);

// Dashboard del profesor
router.get('/professor', authenticate, requireProfessor, getProfessorDashboard);
router.get('/activity', authenticate, requireProfessor, getRecentActivity);

export default router;
