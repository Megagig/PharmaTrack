import express from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(transactionController.getTransactions)
  .post(transactionController.createTransaction);

router
  .route('/:id')
  .get(transactionController.getTransactionById)
  .patch(transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

router.get('/report/financial', transactionController.getFinancialReport);

export default router;
