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
exports.searchSuppliers = exports.getSupplierWithPurchases = exports.deleteSupplier = exports.updateSupplier = exports.getSupplierById = exports.getSuppliers = exports.createSupplier = void 0;
const supplierService = __importStar(require("../services/supplier.service"));
const utils_1 = require("../utils");
exports.createSupplier = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('Unauthorized - pharmacy ID is required', 401));
    }
    const data = Object.assign(Object.assign({}, req.body), { pharmacyId: req.user.pharmacyId });
    const supplier = yield supplierService.createSupplier(data);
    res.status(201).json({
        status: 'success',
        data: { supplier }
    });
}));
exports.getSuppliers = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('Unauthorized - pharmacy ID is required', 401));
    }
    const suppliers = yield supplierService.getSuppliers(req.user.pharmacyId);
    res.status(200).json({
        status: 'success',
        results: suppliers.length,
        data: { suppliers }
    });
}));
exports.getSupplierById = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('Unauthorized - pharmacy ID is required', 401));
    }
    const { id } = req.params;
    const supplier = yield supplierService.getSupplierById(id, req.user.pharmacyId);
    if (!supplier) {
        return next(new utils_1.AppError('Supplier not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { supplier }
    });
}));
exports.updateSupplier = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('Unauthorized - pharmacy ID is required', 401));
    }
    const { id } = req.params;
    const data = req.body;
    const supplier = yield supplierService.updateSupplier(id, req.user.pharmacyId, data);
    if (!supplier) {
        return next(new utils_1.AppError('Supplier not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { supplier }
    });
}));
exports.deleteSupplier = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('Unauthorized - pharmacy ID is required', 401));
    }
    const { id } = req.params;
    yield supplierService.deleteSupplier(id, req.user.pharmacyId);
    res.status(204).json({
        status: 'success',
        data: null
    });
}));
exports.getSupplierWithPurchases = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('Unauthorized - pharmacy ID is required', 401));
    }
    const { id } = req.params;
    const supplierWithPurchases = yield supplierService.getSupplierWithPurchases(id, req.user.pharmacyId);
    if (!supplierWithPurchases) {
        return next(new utils_1.AppError('Supplier not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { supplier: supplierWithPurchases }
    });
}));
exports.searchSuppliers = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.pharmacyId) {
        return next(new utils_1.AppError('Unauthorized - pharmacy ID is required', 401));
    }
    const { q } = req.query;
    const suppliers = yield supplierService.searchSuppliers(req.user.pharmacyId, q);
    res.status(200).json({
        status: 'success',
        results: suppliers.length,
        data: { suppliers }
    });
}));
