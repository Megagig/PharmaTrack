import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';
import { ProductCreateInput, ProductUpdateInput } from '../types/inventory.types';
import { catchAsync, AppError } from '../utils';

export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const data: ProductCreateInput = {
      ...req.body,
      pharmacyId: req.user.pharmacyId
    };

    const product = await productService.createProduct(data);

    res.status(201).json({
      status: 'success',
      data: { product }
    });
  }
);

export const getProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const products = await productService.getProducts(req.user.pharmacyId);

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: { products }
    });
  }
);

export const getProductById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    const product = await productService.getProductById(id, req.user.pharmacyId);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { product }
    });
  }
);

export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    const data: ProductUpdateInput = req.body;
    const product = await productService.updateProduct(id, req.user.pharmacyId, data);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { product }
    });
  }
);

export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    await productService.deleteProduct(id, req.user.pharmacyId);

    res.status(204).json({
      status: 'success',
      data: null
    });
  }
);

export const getLowStockProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const products = await productService.getLowStockProducts(req.user.pharmacyId);

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: { products }
    });
  }
);

export const getExpiringProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const daysThreshold = req.query.days ? parseInt(req.query.days as string, 10) : 30;
    const products = await productService.getExpiringProducts(req.user.pharmacyId, daysThreshold);

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: { products }
    });
  }
);

export const searchProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { q } = req.query;
    const products = await productService.searchProducts(req.user.pharmacyId, q as string);

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: { products }
    });
  }
);

export const getProductCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const categories = await productService.getProductCategories(req.user.pharmacyId);

    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: { categories }
    });
  }
);

export const getInventoryValue = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const value = await productService.getProductInventoryValue(req.user.pharmacyId);

    res.status(200).json({
      status: 'success',
      data: { value }
    });
  }
);
