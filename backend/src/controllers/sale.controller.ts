import { Request, Response, NextFunction } from 'express';
import * as saleService from '../services/sale.service';
import { SaleCreateInput, SaleUpdateInput, SalesReportFilters } from '../types/inventory.types';
import { catchAsync, AppError } from '../utils';

export const createSale = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const data: SaleCreateInput = {
      ...req.body,
      pharmacyId: req.user.pharmacyId
    };

    const sale = await saleService.createSale(data);

    res.status(201).json({
      status: 'success',
      data: { sale }
    });
  }
);

export const getSales = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const sales = await saleService.getSales(req.user.pharmacyId);

    res.status(200).json({
      status: 'success',
      results: sales.length,
      data: { sales }
    });
  }
);

export const getSaleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    const sale = await saleService.getSaleById(id, req.user.pharmacyId);

    if (!sale) {
      return next(new AppError('Sale not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { sale }
    });
  }
);

export const updateSale = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    const data: SaleUpdateInput = req.body;

    const sale = await saleService.updateSale(id, req.user.pharmacyId, data);

    if (!sale) {
      return next(new AppError('Sale not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { sale }
    });
  }
);

export const deleteSale = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    await saleService.deleteSale(id, req.user.pharmacyId);

    res.status(204).json({
      status: 'success',
      data: null
    });
  }
);

export const getSalesReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const filters: SalesReportFilters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      productId: req.query.productId as string,
      category: req.query.category as string
    };

    const report = await saleService.getSalesReport(req.user.pharmacyId, filters);

    res.status(200).json({
      status: 'success',
      data: report
    });
  }
);
