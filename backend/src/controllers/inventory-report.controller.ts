import { Request, Response, NextFunction } from 'express';
import * as inventoryReportService from '../services/inventory-report.service';
import { InventoryReportFilters } from '../types/inventory.types';
import { catchAsync, AppError } from '../utils';

export const getInventorySummary = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('User not authenticated or pharmacy not found', 401));
    }
    
    const summary = await inventoryReportService.getInventorySummary(req.user.pharmacyId);

    res.status(200).json({
      status: 'success',
      data: { summary }
    });
  }
);

export const getStockLevels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('User not authenticated or pharmacy not found', 401));
    }
    
    const stockLevels = await inventoryReportService.getStockLevels(req.user.pharmacyId);

    res.status(200).json({
      status: 'success',
      results: stockLevels.length,
      data: { stockLevels }
    });
  }
);

export const getExpiryReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('User not authenticated or pharmacy not found', 401));
    }
    
    const daysThreshold = req.query.days ? parseInt(req.query.days as string) : 180;
    const expiryReport = await inventoryReportService.getExpiryReport(req.user.pharmacyId, daysThreshold);

    res.status(200).json({
      status: 'success',
      results: expiryReport.length,
      data: { expiryReport }
    });
  }
);

export const getInventoryMovement = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('User not authenticated or pharmacy not found', 401));
    }
    
    const filters: InventoryReportFilters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      productId: req.query.productId as string,
      category: req.query.category as string
    };

    const report = await inventoryReportService.getInventoryMovement(req.user.pharmacyId, filters);

    res.status(200).json({
      status: 'success',
      data: report
    });
  }
);

export const getInventoryValuation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('User not authenticated or pharmacy not found', 401));
    }
    
    const valuation = await inventoryReportService.getInventoryValuation(req.user.pharmacyId);

    res.status(200).json({
      status: 'success',
      data: valuation
    });
  }
);
