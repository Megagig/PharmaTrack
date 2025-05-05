import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

// Register a new user
router.post('/register', authController.register);

// Register a new pharmacy with user
router.post('/register-pharmacy', authController.registerPharmacy);

// Login
router.post('/login', authController.login);

// Get current user
router.get('/me', authenticate, authController.getCurrentUser);

// Change password
router.post('/change-password', authenticate, authController.changePassword);

export default router;
