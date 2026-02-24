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

// ✅ CORS must come BEFORE helmet and everything else
const allowedOrigins = [
  'https://curso-nine-psi.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS bloqueado para origen: ${origin}`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Some browsers (IE11) choke on 204
}));

// ✅ Handle OPTIONS preflight requests explicitly
app.options('*', cors());

// Helmet after CORS
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas solicitudes, por favor intente más tarde'
});
app.use(limiter);
app.use(requestLogger);

// Webhook de Stripe necesita raw body
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

// Body parsing para otras rutas
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
  console.log(`📚 Health check: http://localhost:${PORT}/health`);
});

export default app;