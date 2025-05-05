import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// Register a new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

export default router;
