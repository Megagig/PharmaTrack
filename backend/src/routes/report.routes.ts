import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types';

const router = Router();
const reportController = new ReportController();

// Create a new report (all authenticated users)
router.post(
  '/',
  authenticate,
  reportController.createReport
);

// Get all reports (only executives and admins)
router.get(
  '/',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  reportController.getAllReports
);

// Get report by ID (all authenticated users)
router.get(
  '/:id',
  authenticate,
  reportController.getReportById
);

// Get reports by pharmacy (all authenticated users)
router.get(
  '/pharmacy/:pharmacyId',
  authenticate,
  reportController.getReportsByPharmacy
);

// Update report (all authenticated users)
router.put(
  '/:id',
  authenticate,
  reportController.updateReport
);

// Delete report (only executives and admins)
router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  reportController.deleteReport
);

// Get reports by date range (only executives and admins)
router.get(
  '/date-range',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  reportController.getReportsByDateRange
);

// Get reports by LGA (only executives and admins)
router.get(
  '/lga/:lga',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  reportController.getReportsByLGA
);

// Get reports by ward (only executives and admins)
router.get(
  '/ward/:ward',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  reportController.getReportsByWard
);

// Get reports summary (only executives and admins)
router.get(
  '/summary',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  reportController.getReportsSummary
);

export default router;
