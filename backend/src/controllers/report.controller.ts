import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { ReportCreateRequest } from '../types';

const reportService = new ReportService();

export class ReportController {
  async createReport(req: Request, res: Response): Promise<void> {
    try {
      const data: ReportCreateRequest = req.body;
      const pharmacyId = req.user?.pharmacyId || req.body.pharmacyId;

      if (!pharmacyId) {
        res.status(400).json({ message: 'Pharmacy ID is required' });
        return;
      }

      const result = await reportService.createReport(pharmacyId, data);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Error in createReport:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async getReportById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await reportService.getReportById(id);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in getReportById:', error);
      res.status(404).json({ message: error.message });
    }
  }

  async getReportsByPharmacy(req: Request, res: Response): Promise<void> {
    try {
      const pharmacyId = req.user?.pharmacyId || req.params.pharmacyId;

      if (!pharmacyId) {
        res.status(400).json({ message: 'Pharmacy ID is required' });
        return;
      }

      const result = await reportService.getReportsByPharmacy(pharmacyId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in getReportsByPharmacy:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async getAllReports(req: Request, res: Response): Promise<void> {
    try {
      const result = await reportService.getAllReports();
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in getAllReports:', error);
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
      console.error('Error in updateReport:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async deleteReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await reportService.deleteReport(id);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in deleteReport:', error);
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

      // Parse ISO date strings to Date objects
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      // Validate dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({ message: 'Invalid date format' });
        return;
      }

      // Ensure start date is not after end date
      if (start > end) {
        res.status(400).json({ message: 'Start date must be before end date' });
        return;
      }

      const result = await reportService.getReportsByDateRange(start, end);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in getReportsByDateRange:', error);
      res
        .status(500)
        .json({ message: error.message || 'Failed to fetch reports' });
    }
  }

  async getReportsByLGA(req: Request, res: Response): Promise<void> {
    try {
      const { lga } = req.params;
      const result = await reportService.getReportsByLGA(lga);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in getReportsByLGA:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async getReportsByWard(req: Request, res: Response): Promise<void> {
    try {
      const { ward } = req.params;
      const result = await reportService.getReportsByWard(ward);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in getReportsByWard:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async getReportsSummary(req: Request, res: Response): Promise<void> {
    try {
      const result = await reportService.getReportsSummary();
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in getReportsSummary:', error);
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
      console.error('Error in exportReports:', error);
      res.status(500).json({ message: error.message });
    }
  }
}
