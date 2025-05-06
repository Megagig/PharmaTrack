import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../types';

const router = Router();
const reportController = new ReportController();

// Bind controller methods to ensure correct 'this' context
const createReport = reportController.createReport.bind(reportController);
const getAllReports = reportController.getAllReports.bind(reportController);
const getReportById = reportController.getReportById.bind(reportController);
const getReportsByPharmacy =
  reportController.getReportsByPharmacy.bind(reportController);
const updateReport = reportController.updateReport.bind(reportController);
const deleteReport = reportController.deleteReport.bind(reportController);
const getReportsByDateRange =
  reportController.getReportsByDateRange.bind(reportController);
const getReportsByLGA = reportController.getReportsByLGA.bind(reportController);
const getReportsByWard =
  reportController.getReportsByWard.bind(reportController);
const getReportsSummary =
  reportController.getReportsSummary.bind(reportController);
const exportReports = reportController.exportReports.bind(reportController);

// Create a new report (all authenticated users)
router.post('/', authenticate, createReport);

// Get reports summary (only executives and admins)
router.get(
  '/summary',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  getReportsSummary
);

// Export reports to Excel (only executives and admins)
router.get(
  '/export',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  exportReports
);

// Get reports by date range (only executives and admins)
router.get(
  '/date-range',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  getReportsByDateRange
);

// Get reports by pharmacy (all authenticated users)
router.get('/pharmacy/:pharmacyId', authenticate, getReportsByPharmacy);

// Get reports by LGA (only executives and admins)
router.get(
  '/lga/:lga',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  getReportsByLGA
);

// Get reports by ward (only executives and admins)
router.get(
  '/ward/:ward',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  getReportsByWard
);

// Get all reports (only executives and admins)
router.get(
  '/',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  getAllReports
);

// Get report by ID (all authenticated users)
router.get('/:id', authenticate, getReportById);

// Update report (all authenticated users)
router.put('/:id', authenticate, updateReport);

// Delete report (only executives and admins)
router.delete(
  '/:id',
  authenticate,
  authorize([UserRole.EXECUTIVE, UserRole.ADMIN]),
  deleteReport
);

export default router;
