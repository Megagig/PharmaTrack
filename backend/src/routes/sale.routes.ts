import express from 'express';
import * as saleController from '../controllers/sale.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(saleController.getSales)
  .post(saleController.createSale);

router
  .route('/:id')
  .get(saleController.getSaleById)
  .patch(saleController.updateSale)
  .delete(saleController.deleteSale);

router.get('/report', saleController.getSalesReport);

export default router;
