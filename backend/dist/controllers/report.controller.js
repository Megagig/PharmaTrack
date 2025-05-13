"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const report_service_1 = require("../services/report.service");
const reportService = new report_service_1.ReportService();
class ReportController {
    createReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = req.body;
                const pharmacyId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.pharmacyId) || req.body.pharmacyId;
                if (!pharmacyId) {
                    res.status(400).json({ message: 'Pharmacy ID is required' });
                    return;
                }
                const result = yield reportService.createReport(pharmacyId, data);
                res.status(201).json(result);
            }
            catch (error) {
                console.error('Error in createReport:', error);
                res.status(400).json({ message: error.message });
            }
        });
    }
    getReportById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield reportService.getReportById(id);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error in getReportById:', error);
                res.status(404).json({ message: error.message });
            }
        });
    }
    getReportsByPharmacy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const pharmacyId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.pharmacyId) || req.params.pharmacyId;
                if (!pharmacyId) {
                    res.status(400).json({ message: 'Pharmacy ID is required' });
                    return;
                }
                const result = yield reportService.getReportsByPharmacy(pharmacyId);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error in getReportsByPharmacy:', error);
                res.status(500).json({ message: error.message });
            }
        });
    }
    getAllReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield reportService.getAllReports();
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error in getAllReports:', error);
                res.status(500).json({ message: error.message });
            }
        });
    }
    updateReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                const result = yield reportService.updateReport(id, data);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error in updateReport:', error);
                res.status(400).json({ message: error.message });
            }
        });
    }
    deleteReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield reportService.deleteReport(id);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error in deleteReport:', error);
                res.status(404).json({ message: error.message });
            }
        });
    }
    getReportsByDateRange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                if (!startDate || !endDate) {
                    res
                        .status(400)
                        .json({ message: 'Start date and end date are required' });
                    return;
                }
                // Parse ISO date strings to Date objects
                const start = new Date(startDate);
                const end = new Date(endDate);
                // Validate dates
                if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                    res.status(400).json({ message: 'Invalid date format' });
                    return;
                }
                // Ensure start date is not after end date
                if (start > end) {
                    res.status(400).json({ message: 'Start date must be before end date' });
                    return;
                }
                const result = yield reportService.getReportsByDateRange(start, end);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error in getReportsByDateRange:', error);
                res
                    .status(500)
                    .json({ message: error.message || 'Failed to fetch reports' });
            }
        });
    }
    getReportsByLGA(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lga } = req.params;
                const result = yield reportService.getReportsByLGA(lga);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error in getReportsByLGA:', error);
                res.status(500).json({ message: error.message });
            }
        });
    }
    getReportsByWard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ward } = req.params;
                const result = yield reportService.getReportsByWard(ward);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error in getReportsByWard:', error);
                res.status(500).json({ message: error.message });
            }
        });
    }
    getReportsSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield reportService.getReportsSummary();
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Error in getReportsSummary:', error);
                res.status(500).json({ message: error.message });
            }
        });
    }
    exportReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate, format } = req.query;
                if (!startDate || !endDate) {
                    res
                        .status(400)
                        .json({ message: 'Start date and end date are required' });
                    return;
                }
                const buffer = yield reportService.exportToExcel(new Date(startDate), new Date(endDate), format);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=reports-${new Date().toISOString().split('T')[0]}.xlsx`);
                res.send(buffer);
            }
            catch (error) {
                console.error('Error in exportReports:', error);
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.ReportController = ReportController;
