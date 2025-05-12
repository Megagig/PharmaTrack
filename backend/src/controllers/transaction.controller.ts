import { Request, Response, NextFunction } from 'express';
import * as transactionService from '../services/transaction.service';
import { TransactionCreateInput, FinancialReportFilters } from '../types/inventory.types';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/appError';

export const createTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const data: TransactionCreateInput = {
      ...req.body,
      pharmacyId: req.user.pharmacyId
    };

    const transaction = await transactionService.createTransaction(data);

    res.status(201).json({
      status: 'success',
      data: { transaction }
    });
  }
);

export const getTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const transactions = await transactionService.getTransactions(req.user.pharmacyId);

    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: { transactions }
    });
  }
);

export const getTransactionById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    const transaction = await transactionService.getTransactionById(id, req.user.pharmacyId);

    res.status(200).json({
      status: 'success',
      data: { transaction }
    });
  }
);

export const updateTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    const data: Partial<TransactionCreateInput> = req.body;

    const transaction = await transactionService.updateTransaction(id, req.user.pharmacyId, data);

    res.status(200).json({
      status: 'success',
      data: { transaction }
    });
  }
);

export const deleteTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const { id } = req.params;
    await transactionService.deleteTransaction(id, req.user.pharmacyId);

    res.status(204).json({
      status: 'success',
      data: null
    });
  }
);

export const getFinancialReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.pharmacyId) {
      return next(new AppError('Unauthorized - pharmacy ID is required', 401));
    }

    const filters: FinancialReportFilters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      type: req.query.type as any
    };

    const report = await transactionService.getFinancialReport(req.user.pharmacyId, filters);

    res.status(200).json({
      status: 'success',
      data: report
    });
  }
);
