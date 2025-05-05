import { Request, Response } from 'express';
import { PharmacyService } from '../services/pharmacy.service';
import { PharmacyCreateRequest } from '../types';

const pharmacyService = new PharmacyService();

export class PharmacyController {
  async createPharmacy(req: Request, res: Response) {
    try {
      const data: PharmacyCreateRequest = req.body;
      const result = await pharmacyService.createPharmacy(data);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  async getPharmacyById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pharmacyService.getPharmacyById(id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
  
  async getAllPharmacies(req: Request, res: Response) {
    try {
      const result = await pharmacyService.getAllPharmacies();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  async updatePharmacy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: Partial<PharmacyCreateRequest> = req.body;
      const result = await pharmacyService.updatePharmacy(id, data);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  async deletePharmacy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pharmacyService.deletePharmacy(id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
  
  async getPharmaciesByLGA(req: Request, res: Response) {
    try {
      const { lga } = req.params;
      const result = await pharmacyService.getPharmaciesByLGA(lga);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  async getPharmaciesByWard(req: Request, res: Response) {
    try {
      const { ward } = req.params;
      const result = await pharmacyService.getPharmaciesByWard(ward);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
