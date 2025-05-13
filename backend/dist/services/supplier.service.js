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
exports.searchSuppliers = exports.getSupplierWithPurchases = exports.deleteSupplier = exports.updateSupplier = exports.getSupplierById = exports.getSuppliers = exports.createSupplier = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../utils");
const prisma = new client_1.PrismaClient();
const createSupplier = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.supplier.create({
            data
        });
    }
    catch (error) {
        throw new utils_1.AppError(`Error creating supplier: ${error.message}`, 500);
    }
});
exports.createSupplier = createSupplier;
const getSuppliers = (pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.supplier.findMany({
            where: { pharmacyId },
            orderBy: { name: 'asc' }
        });
    }
    catch (error) {
        throw new utils_1.AppError(`Error fetching suppliers: ${error.message}`, 500);
    }
});
exports.getSuppliers = getSuppliers;
const getSupplierById = (id, pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier = yield prisma.supplier.findFirst({
            where: {
                id,
                pharmacyId
            }
        });
        if (!supplier) {
            throw new utils_1.AppError('Supplier not found', 404);
        }
        return supplier;
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error fetching supplier: ${error.message}`, 500);
    }
});
exports.getSupplierById = getSupplierById;
const updateSupplier = (id, pharmacyId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if supplier exists and belongs to the pharmacy
        const existingSupplier = yield prisma.supplier.findFirst({
            where: {
                id,
                pharmacyId
            }
        });
        if (!existingSupplier) {
            throw new utils_1.AppError('Supplier not found', 404);
        }
        return yield prisma.supplier.update({
            where: { id },
            data
        });
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error updating supplier: ${error.message}`, 500);
    }
});
exports.updateSupplier = updateSupplier;
const deleteSupplier = (id, pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if supplier exists and belongs to the pharmacy
        const existingSupplier = yield prisma.supplier.findFirst({
            where: {
                id,
                pharmacyId
            }
        });
        if (!existingSupplier) {
            throw new utils_1.AppError('Supplier not found', 404);
        }
        // Check if supplier has related purchases
        const purchasesCount = yield prisma.purchase.count({
            where: { supplierId: id }
        });
        if (purchasesCount > 0) {
            throw new utils_1.AppError('Cannot delete supplier with related purchase records', 400);
        }
        yield prisma.supplier.delete({
            where: { id }
        });
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error deleting supplier: ${error.message}`, 500);
    }
});
exports.deleteSupplier = deleteSupplier;
const getSupplierWithPurchases = (id, pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier = yield prisma.supplier.findFirst({
            where: {
                id,
                pharmacyId
            },
            include: {
                purchases: {
                    orderBy: {
                        purchaseDate: 'desc'
                    }
                }
            }
        });
        if (!supplier) {
            throw new utils_1.AppError('Supplier not found', 404);
        }
        return supplier;
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error fetching supplier with purchases: ${error.message}`, 500);
    }
});
exports.getSupplierWithPurchases = getSupplierWithPurchases;
const searchSuppliers = (pharmacyId, searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.supplier.findMany({
            where: {
                pharmacyId,
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { contactName: { contains: searchTerm, mode: 'insensitive' } },
                    { email: { contains: searchTerm, mode: 'insensitive' } },
                    { phone: { contains: searchTerm, mode: 'insensitive' } }
                ]
            },
            orderBy: { name: 'asc' }
        });
    }
    catch (error) {
        throw new utils_1.AppError(`Error searching suppliers: ${error.message}`, 500);
    }
});
exports.searchSuppliers = searchSuppliers;
