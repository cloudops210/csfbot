import express from 'express';
import { createCheckoutSession, handleWebhook, createPortalSession } from '../controllers/subscriptionController';
import auth from '../middleware/auth';

const router = express.Router();

// Create Stripe Checkout session
router.post('/create-checkout-session', auth, (req, res, next) => {
  createCheckoutSession(req, res).catch(next);
});

// Create Stripe Customer Portal session
router.post('/create-portal-session', auth, (req, res, next) => {
  createPortalSession(req, res).catch(next);
});

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  handleWebhook(req, res).catch(next);
});

export default router; 