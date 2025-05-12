import express from 'express';
import * as supplierController from '../controllers/supplier.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(supplierController.getSuppliers)
  .post(supplierController.createSupplier);

router
  .route('/:id')
  .get(supplierController.getSupplierById)
  .patch(supplierController.updateSupplier)
  .delete(supplierController.deleteSupplier);

router.get('/:id/purchases', supplierController.getSupplierWithPurchases);
router.get('/search', supplierController.searchSuppliers);

export default router;
