import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { ReportCreateRequest } from '../types';

const reportService = new ReportService();

export class ReportController {
  async createReport(req: Request, res: Response): Promise<void> {
    try {
      const data: ReportCreateRequest = req.body;

      // Get pharmacyId from authenticated user or from request body
      const pharmacyId = req.user?.pharmacyId || req.body.pharmacyId;

      if (!pharmacyId) {
        res.status(400).json({ message: 'Pharmacy ID is required' });
        return;
      }

      const result = await reportService.createReport(pharmacyId, data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getReportById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await reportService.getReportById(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async getReportsByPharmacy(req: Request, res: Response): Promise<void> {
    try {
      // Get pharmacyId from authenticated user or from request params
      const pharmacyId = req.user?.pharmacyId || req.params.pharmacyId;

      if (!pharmacyId) {
        res.status(400).json({ message: 'Pharmacy ID is required' });
        return;
      }

      const result = await reportService.getReportsByPharmacy(pharmacyId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllReports(req: Request, res: Response): Promise<void> {
    try {
      const result = await reportService.getAllReports();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data: Partial<ReportCreateRequest> = req.body;
      const result = await reportService.updateReport(id, data);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await reportService.deleteReport(id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async getReportsByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res
          .status(400)
          .json({ message: 'Start date and end date are required' });
        return;
      }

      const result = await reportService.getReportsByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getReportsByLGA(req: Request, res: Response): Promise<void> {
    try {
      const { lga } = req.params;
      const result = await reportService.getReportsByLGA(lga);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getReportsByWard(req: Request, res: Response): Promise<void> {
    try {
      const { ward } = req.params;
      const result = await reportService.getReportsByWard(ward);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getReportsSummary(req: Request, res: Response): Promise<void> {
    try {
      const result = await reportService.getReportsSummary();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async exportReports(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, format } = req.query;

      if (!startDate || !endDate) {
        res
          .status(400)
          .json({ message: 'Start date and end date are required' });
        return;
      }

      const buffer = await reportService.exportToExcel(
        new Date(startDate as string),
        new Date(endDate as string),
        format as 'detailed' | 'summary'
      );

      // Set headers for file download
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=reports-${
          new Date().toISOString().split('T')[0]
        }.xlsx`
      );

      res.send(buffer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
