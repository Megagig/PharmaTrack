import { Request, Response } from 'express';
import { PharmacyService } from '../services/pharmacy.service';
import { PharmacyCreateRequest } from '../types';

const pharmacyService = new PharmacyService();

export class PharmacyController {
  async createPharmacy(req: Request, res: Response): Promise<void> {
    try {
      const data: PharmacyCreateRequest = req.body;
      const result = await pharmacyService.createPharmacy(data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPharmacyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await pharmacyService.getPharmacyById(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async getAllPharmacies(req: Request, res: Response): Promise<void> {
    try {
      const result = await pharmacyService.getAllPharmacies();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updatePharmacy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: Partial<PharmacyCreateRequest> = req.body;
      const result = await pharmacyService.updatePharmacy(id, data);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deletePharmacy(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await pharmacyService.deletePharmacy(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async getPharmaciesByLGA(req: Request, res: Response): Promise<void> {
    try {
      const { lga } = req.params;
      const result = await pharmacyService.getPharmaciesByLGA(lga);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getPharmaciesByWard(req: Request, res: Response): Promise<void> {
    try {
      const { ward } = req.params;
      const result = await pharmacyService.getPharmaciesByWard(ward);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
