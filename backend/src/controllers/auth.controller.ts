import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginRequest, RegisterRequest } from '../types';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const data: RegisterRequest = req.body;
      const result = await authService.register(data);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  async login(req: Request, res: Response) {
    try {
      const data: LoginRequest = req.body;
      const result = await authService.login(data);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }
}
