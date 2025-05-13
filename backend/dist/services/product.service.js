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
exports.getProductInventoryValue = exports.getProductCategories = exports.searchProducts = exports.getExpiringProducts = exports.getLowStockProducts = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../utils");
const prisma = new client_1.PrismaClient();
const createProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if product with same SKU already exists
        const existingProduct = yield prisma.product.findUnique({
            where: { sku: data.sku }
        });
        if (existingProduct) {
            throw new utils_1.AppError('Product with this SKU already exists', 400);
        }
        // Ensure expiryDate is a proper Date object
        const productData = Object.assign(Object.assign({}, data), { expiryDate: data.expiryDate ? new Date(data.expiryDate) : null });
        return yield prisma.product.create({
            data: productData
        });
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error creating product: ${error.message}`, 500);
    }
});
exports.createProduct = createProduct;
const getProducts = (pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.product.findMany({
            where: { pharmacyId },
            orderBy: { name: 'asc' }
        });
    }
    catch (error) {
        throw new utils_1.AppError(`Error fetching products: ${error.message}`, 500);
    }
});
exports.getProducts = getProducts;
const getProductById = (id, pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma.product.findFirst({
            where: {
                id,
                pharmacyId
            }
        });
        if (!product) {
            throw new utils_1.AppError('Product not found', 404);
        }
        return product;
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error fetching product: ${error.message}`, 500);
    }
});
exports.getProductById = getProductById;
const updateProduct = (id, pharmacyId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if product exists and belongs to the pharmacy
        const existingProduct = yield prisma.product.findFirst({
            where: {
                id,
                pharmacyId
            }
        });
        if (!existingProduct) {
            throw new utils_1.AppError('Product not found', 404);
        }
        // If SKU is being updated, check if it's unique
        if (data.sku && data.sku !== existingProduct.sku) {
            const skuExists = yield prisma.product.findUnique({
                where: { sku: data.sku }
            });
            if (skuExists) {
                throw new utils_1.AppError('Product with this SKU already exists', 400);
            }
        }
        return yield prisma.product.update({
            where: { id },
            data
        });
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error updating product: ${error.message}`, 500);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (id, pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if product exists and belongs to the pharmacy
        const existingProduct = yield prisma.product.findFirst({
            where: {
                id,
                pharmacyId
            }
        });
        if (!existingProduct) {
            throw new utils_1.AppError('Product not found', 404);
        }
        // Check if product has related records
        const purchaseItems = yield prisma.purchaseItem.count({
            where: { productId: id }
        });
        const saleItems = yield prisma.saleItem.count({
            where: { productId: id }
        });
        if (purchaseItems > 0 || saleItems > 0) {
            throw new utils_1.AppError('Cannot delete product with related purchase or sale records', 400);
        }
        yield prisma.product.delete({
            where: { id }
        });
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error deleting product: ${error.message}`, 500);
    }
});
exports.deleteProduct = deleteProduct;
const getLowStockProducts = (pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.product.findMany({
            where: {
                pharmacyId,
                currentStock: {
                    lte: prisma.product.fields.reorderLevel
                }
            },
            orderBy: [
                { currentStock: 'asc' },
                { name: 'asc' }
            ]
        });
    }
    catch (error) {
        throw new utils_1.AppError(`Error fetching low stock products: ${error.message}`, 500);
    }
});
exports.getLowStockProducts = getLowStockProducts;
const getExpiringProducts = (pharmacyId_1, ...args_1) => __awaiter(void 0, [pharmacyId_1, ...args_1], void 0, function* (pharmacyId, daysThreshold = 90) {
    try {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
        // Find batch items that are expiring soon
        const expiringBatches = yield prisma.batchItem.findMany({
            where: {
                product: {
                    pharmacyId
                },
                expiryDate: {
                    lte: thresholdDate
                },
                currentQuantity: {
                    gt: 0
                }
            },
            include: {
                product: true
            },
            orderBy: {
                expiryDate: 'asc'
            }
        });
        return expiringBatches.map(batch => {
            const today = new Date();
            const daysToExpiry = Math.ceil((batch.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return {
                id: batch.id,
                productId: batch.productId,
                productName: batch.product.name,
                batchNumber: batch.batchNumber,
                expiryDate: batch.expiryDate,
                currentQuantity: batch.currentQuantity,
                daysToExpiry,
                status: daysToExpiry <= 0 ? 'EXPIRED' : daysToExpiry <= 30 ? 'EXPIRING_SOON' : 'NORMAL'
            };
        });
    }
    catch (error) {
        throw new utils_1.AppError(`Error fetching expiring products: ${error.message}`, 500);
    }
});
exports.getExpiringProducts = getExpiringProducts;
const searchProducts = (pharmacyId, searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.product.findMany({
            where: {
                pharmacyId,
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { sku: { contains: searchTerm, mode: 'insensitive' } },
                    { barcode: { contains: searchTerm, mode: 'insensitive' } },
                    { category: { contains: searchTerm, mode: 'insensitive' } },
                    { manufacturer: { contains: searchTerm, mode: 'insensitive' } }
                ]
            },
            orderBy: { name: 'asc' }
        });
    }
    catch (error) {
        throw new utils_1.AppError(`Error searching products: ${error.message}`, 500);
    }
});
exports.searchProducts = searchProducts;
const getProductCategories = (pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany({
            where: { pharmacyId },
            select: { category: true },
            distinct: ['category']
        });
        return products.map(product => product.category).sort();
    }
    catch (error) {
        throw new utils_1.AppError(`Error fetching product categories: ${error.message}`, 500);
    }
});
exports.getProductCategories = getProductCategories;
const getProductInventoryValue = (pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany({
            where: { pharmacyId },
            select: {
                costPrice: true,
                currentStock: true
            }
        });
        return products.reduce((total, product) => {
            return total + (product.costPrice * product.currentStock);
        }, 0);
    }
    catch (error) {
        throw new utils_1.AppError(`Error calculating inventory value: ${error.message}`, 500);
    }
});
exports.getProductInventoryValue = getProductInventoryValue;
