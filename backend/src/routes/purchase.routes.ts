import express from 'express';
import * as purchaseController from '../controllers/purchase.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(purchaseController.getPurchases)
  .post(purchaseController.createPurchase);

router
  .route('/:id')
  .get(purchaseController.getPurchaseById)
  .patch(purchaseController.updatePurchase)
  .delete(purchaseController.deletePurchase);

router.get('/report', purchaseController.getPurchaseReport);

export default router;
