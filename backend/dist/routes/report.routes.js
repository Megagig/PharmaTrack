"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("../controllers/report.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const types_1 = require("../types");
const router = (0, express_1.Router)();
const reportController = new report_controller_1.ReportController();
// Bind controller methods to ensure correct 'this' context
const createReport = reportController.createReport.bind(reportController);
const getAllReports = reportController.getAllReports.bind(reportController);
const getReportById = reportController.getReportById.bind(reportController);
const getReportsByPharmacy = reportController.getReportsByPharmacy.bind(reportController);
const updateReport = reportController.updateReport.bind(reportController);
const deleteReport = reportController.deleteReport.bind(reportController);
const getReportsByDateRange = reportController.getReportsByDateRange.bind(reportController);
const getReportsByLGA = reportController.getReportsByLGA.bind(reportController);
const getReportsByWard = reportController.getReportsByWard.bind(reportController);
const getReportsSummary = reportController.getReportsSummary.bind(reportController);
const exportReports = reportController.exportReports.bind(reportController);
// Create a new report (all authenticated users)
router.post('/', auth_middleware_1.authenticate, createReport);
// Get reports summary (only executives and admins)
router.get('/summary', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.EXECUTIVE, types_1.UserRole.ADMIN]), getReportsSummary);
// Export reports to Excel (only executives and admins)
router.get('/export', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.EXECUTIVE, types_1.UserRole.ADMIN]), exportReports);
// Get reports by date range (only executives and admins)
router.get('/date-range', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.EXECUTIVE, types_1.UserRole.ADMIN]), getReportsByDateRange);
// Get reports by pharmacy (all authenticated users)
router.get('/pharmacy/:pharmacyId', auth_middleware_1.authenticate, getReportsByPharmacy);
// Get reports by LGA (only executives and admins)
router.get('/lga/:lga', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.EXECUTIVE, types_1.UserRole.ADMIN]), getReportsByLGA);
// Get reports by ward (only executives and admins)
router.get('/ward/:ward', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.EXECUTIVE, types_1.UserRole.ADMIN]), getReportsByWard);
// Get all reports (only executives and admins)
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.EXECUTIVE, types_1.UserRole.ADMIN]), getAllReports);
// Get report by ID (all authenticated users)
router.get('/:id', auth_middleware_1.authenticate, getReportById);
// Update report (all authenticated users)
router.put('/:id', auth_middleware_1.authenticate, updateReport);
// Delete report (only executives and admins)
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([types_1.UserRole.EXECUTIVE, types_1.UserRole.ADMIN]), deleteReport);
exports.default = router;
