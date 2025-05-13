import { Request, Response } from 'express';

export class HealthController {
  /**
   * Check API health
   * @param req Request object
   * @param res Response object
   */
  async checkHealth(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        status: 'success',
        message: 'API is healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      });
    } catch (error: any) {
      console.error('Error in health check:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
      });
    }
  }
}
