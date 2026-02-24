import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Rutas
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import moduleRoutes from './routes/modules';
import paymentRoutes from './routes/payments';
import applicationRoutes from './routes/applications';
import adminRoutes from './routes/admin';
import webhookRoutes from './routes/webhooks';
import dashboardRoutes from './routes/dashboard';

dotenv.config();

const app = express();

// Trust proxy - importante para Render
app.set('trust proxy', 1);

const PORT = process.env.PORT || 10000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite por IP
  message: 'Demasiadas solicitudes, por favor intente más tarde'
});

// Middlewares
app.use(helmet());
// DESPUÉS:
app.use(cors({
  origin: [
    'https://curso-nine-psi.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://spirited-creativity-production.up.railway.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(limiter);
app.use(requestLogger);

// DESPUÉS:
// Webhook de Stripe necesita raw body (solo para la ruta específica)
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

// Body parsing para otras rutas (incluyendo el webhook de Google Forms)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/health`);
});

export default app;
