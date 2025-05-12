import { Request, Response, NextFunction } from 'express';
import * as supplierService from '../services/supplier.service';
import { SupplierCreateInput, SupplierUpdateInput } from '../types/inventory.types';
import { catchAsync, AppError } from '../utils';

export const createSupplier = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const data: SupplierCreateInput = {
      ...req.body,
      pharmacyId: req.user.pharmacyId
    };

    const supplier = await supplierService.createSupplier(data);

    res.status(201).json({
      status: 'success',
      data: { supplier }
    });
  }
);

export const getSuppliers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const suppliers = await supplierService.getSuppliers(req.user.pharmacyId);

    res.status(200).json({
      status: 'success',
      results: suppliers.length,
      data: { suppliers }
    });
  }
);

export const getSupplierById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    const supplier = await supplierService.getSupplierById(id, req.user.pharmacyId);

    if (!supplier) {
      return next(new AppError('Supplier not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { supplier }
    });
  }
);

export const updateSupplier = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    const data: SupplierUpdateInput = req.body;

    const supplier = await supplierService.updateSupplier(id, req.user.pharmacyId, data);

    if (!supplier) {
      return next(new AppError('Supplier not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { supplier }
    });
  }
);

export const deleteSupplier = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    await supplierService.deleteSupplier(id, req.user.pharmacyId);

    res.status(204).json({
      status: 'success',
      data: null
    });
  }
);

export const getSupplierWithPurchases = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    const supplierWithPurchases = await supplierService.getSupplierWithPurchases(id, req.user.pharmacyId);

    if (!supplierWithPurchases) {
      return next(new AppError('Supplier not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { supplier: supplierWithPurchases }
    });
  }
);

export const searchSuppliers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { q } = req.query;
    const suppliers = await supplierService.searchSuppliers(req.user.pharmacyId, q as string);

    res.status(200).json({
      status: 'success',
      results: suppliers.length,
      data: { suppliers }
    });
  }
);
