import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const healthController = new HealthController();

// Bind controller methods to ensure correct 'this' context
const checkHealth = healthController.checkHealth.bind(healthController);

// Health check endpoint (public)
router.get('/', checkHealth);

export default router;
