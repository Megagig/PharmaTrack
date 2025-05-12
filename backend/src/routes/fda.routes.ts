import { Router } from 'express';
import { FDAController } from '../controllers/fda.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const fdaController = new FDAController();

// Bind controller methods to ensure correct 'this' context
const getMedications = fdaController.getMedications.bind(fdaController);
const getAilments = fdaController.getAilments.bind(fdaController);

// Get medications (authenticated users only)
router.get('/medications', authenticate, getMedications);

// Get ailments (authenticated users only)
router.get('/ailments', authenticate, getAilments);

export default router;
