import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import {
  LoginRequest,
  RegisterRequest,
  PharmacyRegisterRequest,
  ChangePasswordRequest,
  AuthenticatedRequest,
} from '../types';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegisterRequest = req.body;
      const result = await authService.register(data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async registerPharmacy(req: Request, res: Response): Promise<void> {
    try {
      const data: PharmacyRegisterRequest = req.body;
      const result = await authService.registerPharmacy(data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data: LoginRequest = req.body;
      const result = await authService.login(data);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async getCurrentUser(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await authService.getCurrentUser(userId);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async changePassword(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const data: ChangePasswordRequest = req.body;
      await authService.changePassword(userId, data);
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
