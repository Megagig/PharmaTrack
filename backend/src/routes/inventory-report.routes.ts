import express from 'express';
import * as inventoryReportController from '../controllers/inventory-report.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/summary', inventoryReportController.getInventorySummary);
router.get('/stock-levels', inventoryReportController.getStockLevels);
router.get('/expiry', inventoryReportController.getExpiryReport);
router.get('/movement', inventoryReportController.getInventoryMovement);
router.get('/valuation', inventoryReportController.getInventoryValuation);

export default router;
