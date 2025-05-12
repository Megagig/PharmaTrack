import { Request, Response } from 'express';
import { FDAService } from '../services/fda.service';

const fdaService = new FDAService();

export class FDAController {
  /**
   * Get medications from FDA API
   * @param req Request object
   * @param res Response object
   */
  async getMedications(req: Request, res: Response): Promise<void> {
    try {
      // Get limit from query params or use default
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      
      const medications = await fdaService.getMedications(limit);
      res.status(200).json(medications);
    } catch (error: any) {
      console.error('Error in getMedications controller:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch medications' });
    }
  }

  /**
   * Get common ailments
   * @param req Request object
   * @param res Response object
   */
  async getAilments(req: Request, res: Response): Promise<void> {
    try {
      const ailments = await fdaService.getAilments();
      res.status(200).json(ailments);
    } catch (error: any) {
      console.error('Error in getAilments controller:', error);
      res.status(500).json({ message: error.message || 'Failed to fetch ailments' });
    }
  }
}
