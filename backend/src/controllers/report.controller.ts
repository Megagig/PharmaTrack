import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { ReportCreateRequest } from '../types';

const reportService = new ReportService();

export class ReportController {
  async createReport(req: Request, res: Response) {
    try {
      const data: ReportCreateRequest = req.body;
      
      // Get pharmacyId from authenticated user or from request body
      const pharmacyId = req.user?.pharmacyId || req.body.pharmacyId;
      
      if (!pharmacyId) {
        return res.status(400).json({ message: 'Pharmacy ID is required' });
      }
      
      const result = await reportService.createReport(pharmacyId, data);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  async getReportById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await reportService.getReportById(id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
  
  async getReportsByPharmacy(req: Request, res: Response) {
    try {
      // Get pharmacyId from authenticated user or from request params
      const pharmacyId = req.user?.pharmacyId || req.params.pharmacyId;
      
      if (!pharmacyId) {
        return res.status(400).json({ message: 'Pharmacy ID is required' });
      }
      
      const result = await reportService.getReportsByPharmacy(pharmacyId);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  async getAllReports(req: Request, res: Response) {
    try {
      const result = await reportService.getAllReports();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  async updateReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: Partial<ReportCreateRequest> = req.body;
      const result = await reportService.updateReport(id, data);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  async deleteReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await reportService.deleteReport(id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
  
  async getReportsByDateRange(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required' });
      }
      
      const result = await reportService.getReportsByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  async getReportsByLGA(req: Request, res: Response) {
    try {
      const { lga } = req.params;
      const result = await reportService.getReportsByLGA(lga);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  async getReportsByWard(req: Request, res: Response) {
    try {
      const { ward } = req.params;
      const result = await reportService.getReportsByWard(ward);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  async getReportsSummary(req: Request, res: Response) {
    try {
      const result = await reportService.getReportsSummary();
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
