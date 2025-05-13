"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getInventoryValuation = exports.getInventoryMovement = exports.getExpiryReport = exports.getStockLevels = exports.getInventorySummary = void 0;
const inventoryReportService = __importStar(require("../services/inventory-report.service"));
const utils_1 = require("../utils");
exports.getInventorySummary = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('User not authenticated or pharmacy not found', 401));
    }
    const summary = yield inventoryReportService.getInventorySummary(req.user.pharmacyId);
    res.status(200).json({
        status: 'success',
        data: { summary }
    });
}));
exports.getStockLevels = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('User not authenticated or pharmacy not found', 401));
    }
    const stockLevels = yield inventoryReportService.getStockLevels(req.user.pharmacyId);
    res.status(200).json({
        status: 'success',
        results: stockLevels.length,
        data: { stockLevels }
    });
}));
exports.getExpiryReport = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('User not authenticated or pharmacy not found', 401));
    }
    const daysThreshold = req.query.days ? parseInt(req.query.days) : 180;
    const expiryReport = yield inventoryReportService.getExpiryReport(req.user.pharmacyId, daysThreshold);
    res.status(200).json({
        status: 'success',
        results: expiryReport.length,
        data: { expiryReport }
    });
}));
exports.getInventoryMovement = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('User not authenticated or pharmacy not found', 401));
    }
    const filters = {
        startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
        productId: req.query.productId,
        category: req.query.category
    };
    const report = yield inventoryReportService.getInventoryMovement(req.user.pharmacyId, filters);
    res.status(200).json({
        status: 'success',
        data: report
    });
}));
exports.getInventoryValuation = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('User not authenticated or pharmacy not found', 401));
    }
    const valuation = yield inventoryReportService.getInventoryValuation(req.user.pharmacyId);
    res.status(200).json({
        status: 'success',
        data: valuation
    });
}));
