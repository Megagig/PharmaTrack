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
exports.getSalesReport = exports.deleteSale = exports.updateSale = exports.getSaleById = exports.getSales = exports.createSale = void 0;
const saleService = __importStar(require("../services/sale.service"));
const utils_1 = require("../utils");
exports.createSale = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('Unauthorized - pharmacy ID is required', 401));
    }
    const data = Object.assign(Object.assign({}, req.body), { pharmacyId: req.user.pharmacyId });
    const sale = yield saleService.createSale(data);
    res.status(201).json({
        status: 'success',
        data: { sale }
    });
}));
exports.getSales = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('Unauthorized - pharmacy ID is required', 401));
    }
    const sales = yield saleService.getSales(req.user.pharmacyId);
    res.status(200).json({
        status: 'success',
        results: sales.length,
        data: { sales }
    });
}));
exports.getSaleById = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('Unauthorized - pharmacy ID is required', 401));
    }
    const { id } = req.params;
    const sale = yield saleService.getSaleById(id, req.user.pharmacyId);
    if (!sale) {
        return next(new utils_1.AppError('Sale not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { sale }
    });
}));
exports.updateSale = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('Unauthorized - pharmacy ID is required', 401));
    }
    const { id } = req.params;
    const data = req.body;
    const sale = yield saleService.updateSale(id, req.user.pharmacyId, data);
    if (!sale) {
        return next(new utils_1.AppError('Sale not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { sale }
    });
}));
exports.deleteSale = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('Unauthorized - pharmacy ID is required', 401));
    }
    const { id } = req.params;
    yield saleService.deleteSale(id, req.user.pharmacyId);
    res.status(204).json({
        status: 'success',
        data: null
    });
}));
exports.getSalesReport = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('Unauthorized - pharmacy ID is required', 401));
    }
    const filters = {
        startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
        productId: req.query.productId,
        category: req.query.category
    };
    const report = yield saleService.getSalesReport(req.user.pharmacyId, filters);
    res.status(200).json({
        status: 'success',
        data: report
    });
}));
