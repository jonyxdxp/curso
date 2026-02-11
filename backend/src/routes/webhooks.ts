import { Router } from 'express';
import { stripeWebhook, googleFormsWebhook, webhookHealth } from '../controllers/webhookController';

const router = Router();

// Health check
router.get('/health', webhookHealth);

// Stripe webhook - usa raw body
router.post('/stripe', stripeWebhook);

// Google Forms webhook
router.post('/google-forms', googleFormsWebhook);

export default router;
