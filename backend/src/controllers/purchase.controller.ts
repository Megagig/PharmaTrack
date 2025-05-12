import { Request, Response, NextFunction } from 'express';
import * as purchaseService from '../services/purchase.service';
import { PurchaseCreateInput, PurchaseUpdateInput, PurchaseReportFilters } from '../types/inventory.types';
import { catchAsync, AppError } from '../utils';

export const createPurchase = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const data: PurchaseCreateInput = {
      ...req.body,
      pharmacyId: req.user.pharmacyId
    };

    const purchase = await purchaseService.createPurchase(data);

    res.status(201).json({
      status: 'success',
      data: { purchase }
    });
  }
);

export const getPurchases = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const purchases = await purchaseService.getPurchases(req.user.pharmacyId);

    res.status(200).json({
      status: 'success',
      results: purchases.length,
      data: { purchases }
    });
  }
);

export const getPurchaseById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    const purchase = await purchaseService.getPurchaseById(id, req.user.pharmacyId);

    if (!purchase) {
      return next(new AppError('Purchase not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { purchase }
    });
  }
);

export const updatePurchase = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    const data: PurchaseUpdateInput = req.body;

    const purchase = await purchaseService.updatePurchase(id, req.user.pharmacyId, data);

    if (!purchase) {
      return next(new AppError('Purchase not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { purchase }
    });
  }
);

export const deletePurchase = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    await purchaseService.deletePurchase(id, req.user.pharmacyId);

    res.status(204).json({
      status: 'success',
      data: null
    });
  }
);

export const getPurchaseReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const filters: PurchaseReportFilters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      supplierId: req.query.supplierId as string,
      productId: req.query.productId as string
    };

    const report = await purchaseService.getPurchaseReport(req.user.pharmacyId, filters);

    res.status(200).json({
      status: 'success',
      data: report
    });
  }
);
