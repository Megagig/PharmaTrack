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
exports.getInventoryValuation = exports.getInventoryMovement = exports.getExpiryReport = exports.getStockLevels = exports.getInventorySummary = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../utils");
const prisma = new client_1.PrismaClient();
const getInventorySummary = (pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get total products count
        const totalProducts = yield prisma.product.count({
            where: { pharmacyId }
        });
        // Calculate total stock value
        const products = yield prisma.product.findMany({
            where: { pharmacyId },
            select: {
                id: true,
                name: true,
                costPrice: true,
                retailPrice: true,
                currentStock: true
            }
        });
        const inventoryValue = products.reduce((sum, product) => {
            return sum + (product.costPrice * product.currentStock);
        }, 0);
        // Count low stock items
        const lowStockProducts = yield prisma.product.count({
            where: {
                pharmacyId,
                currentStock: {
                    lte: prisma.product.fields.reorderLevel
                }
            }
        });
        // Count expiring items (within 90 days)
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + 90);
        const expiringProducts = yield prisma.batchItem.count({
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
            }
        });
        // Get total suppliers
        const totalSuppliers = yield prisma.supplier.count({
            where: { pharmacyId }
        });
        // Get purchases this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const purchasesThisMonth = yield prisma.purchase.count({
            where: {
                pharmacyId,
                purchaseDate: {
                    gte: startOfMonth
                }
            }
        });
        // Get sales this month
        const salesThisMonth = yield prisma.sale.count({
            where: {
                pharmacyId,
                saleDate: {
                    gte: startOfMonth
                }
            }
        });
        // Get top selling products
        const topSellingProducts = yield prisma.saleItem.groupBy({
            by: ['productId'],
            where: {
                sale: {
                    pharmacyId
                }
            },
            _sum: {
                quantity: true,
                totalPrice: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 5
        });
        // Get product details for top selling products
        const topProductsWithDetails = yield Promise.all(topSellingProducts.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const product = yield prisma.product.findUnique({
                where: { id: item.productId },
                select: { id: true, name: true }
            });
            return {
                id: (product === null || product === void 0 ? void 0 : product.id) || '',
                name: (product === null || product === void 0 ? void 0 : product.name) || 'Unknown Product',
                quantity: ((_a = item._sum) === null || _a === void 0 ? void 0 : _a.quantity) || 0,
                revenue: ((_b = item._sum) === null || _b === void 0 ? void 0 : _b.totalPrice) || 0
            };
        })));
        // Get recent transactions
        const recentPurchases = yield prisma.purchase.findMany({
            where: { pharmacyId },
            select: {
                id: true,
                purchaseDate: true,
                invoiceNumber: true,
                totalAmount: true
            },
            orderBy: { purchaseDate: 'desc' },
            take: 3
        });
        const recentSales = yield prisma.sale.findMany({
            where: { pharmacyId },
            select: {
                id: true,
                saleDate: true,
                invoiceNumber: true,
                totalAmount: true
            },
            orderBy: { saleDate: 'desc' },
            take: 3
        });
        const recentTransactions = [
            ...recentPurchases.map(p => ({
                id: p.id,
                type: 'PURCHASE',
                date: p.purchaseDate,
                amount: p.totalAmount,
                reference: p.invoiceNumber
            })),
            ...recentSales.map(s => ({
                id: s.id,
                type: 'SALE',
                date: s.saleDate,
                amount: s.totalAmount,
                reference: s.invoiceNumber
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
        return {
            totalProducts,
            lowStockProducts,
            expiringProducts,
            totalSuppliers,
            purchasesThisMonth,
            salesThisMonth,
            inventoryValue,
            topSellingProducts: topProductsWithDetails,
            recentTransactions
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new utils_1.AppError(`Error generating inventory summary: ${errorMessage}`, 500);
    }
});
exports.getInventorySummary = getInventorySummary;
const getStockLevels = (pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany({
            where: { pharmacyId },
            select: {
                id: true,
                name: true,
                sku: true,
                currentStock: true,
                reorderLevel: true
            },
            orderBy: [
                { currentStock: 'asc' },
                { name: 'asc' }
            ]
        });
        return products.map(product => {
            let status = 'NORMAL';
            if (product.currentStock === 0) {
                status = 'OUT_OF_STOCK';
            }
            else if (product.currentStock <= product.reorderLevel) {
                status = 'LOW';
            }
            return {
                id: product.id,
                name: product.name,
                sku: product.sku,
                currentStock: product.currentStock,
                reorderLevel: product.reorderLevel,
                status
            };
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new utils_1.AppError(`Error fetching stock levels: ${errorMessage}`, 500);
    }
});
exports.getStockLevels = getStockLevels;
const getExpiryReport = (pharmacyId_1, ...args_1) => __awaiter(void 0, [pharmacyId_1, ...args_1], void 0, function* (pharmacyId, daysThreshold = 180) {
    try {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
        const batchItems = yield prisma.batchItem.findMany({
            where: {
                product: {
                    pharmacyId
                },
                currentQuantity: {
                    gt: 0
                }
            },
            include: {
                product: {
                    select: {
                        name: true,
                        sku: true
                    }
                }
            },
            orderBy: {
                expiryDate: 'asc'
            }
        });
        const today = new Date();
        return batchItems.map(batch => {
            const daysToExpiry = Math.ceil((batch.expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            let status = 'NORMAL';
            if (daysToExpiry <= 0) {
                status = 'EXPIRED';
            }
            else if (daysToExpiry <= 30) {
                status = 'EXPIRING_SOON';
            }
            return {
                id: batch.id,
                name: batch.product.name,
                sku: batch.product.sku,
                batchNumber: batch.batchNumber,
                expiryDate: batch.expiryDate,
                currentQuantity: batch.currentQuantity,
                daysToExpiry,
                status
            };
        }).filter(item => item.daysToExpiry <= daysThreshold);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new utils_1.AppError(`Error generating expiry report: ${errorMessage}`, 500);
    }
});
exports.getExpiryReport = getExpiryReport;
const getInventoryMovement = (pharmacyId, filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, productId, category } = filters;
        // Build where clauses based on filters
        const purchaseWhereClause = {
            purchase: {
                pharmacyId
            }
        };
        const saleWhereClause = {
            sale: {
                pharmacyId
            }
        };
        if (startDate && endDate) {
            purchaseWhereClause.purchase.purchaseDate = {
                gte: startDate,
                lte: endDate
            };
            saleWhereClause.sale.saleDate = {
                gte: startDate,
                lte: endDate
            };
        }
        else if (startDate) {
            purchaseWhereClause.purchase.purchaseDate = {
                gte: startDate
            };
            saleWhereClause.sale.saleDate = {
                gte: startDate
            };
        }
        else if (endDate) {
            purchaseWhereClause.purchase.purchaseDate = {
                lte: endDate
            };
            saleWhereClause.sale.saleDate = {
                lte: endDate
            };
        }
        // Product filter
        if (productId) {
            purchaseWhereClause.productId = productId;
            saleWhereClause.productId = productId;
        }
        // Category filter
        if (category) {
            purchaseWhereClause.product = {
                category
            };
            saleWhereClause.product = {
                category
            };
        }
        // Get purchase items
        const purchaseItems = yield prisma.purchaseItem.findMany({
            where: purchaseWhereClause,
            include: {
                product: true,
                purchase: {
                    select: {
                        purchaseDate: true,
                        invoiceNumber: true,
                        supplier: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                purchase: {
                    purchaseDate: 'asc'
                }
            }
        });
        // Get sale items
        const saleItems = yield prisma.saleItem.findMany({
            where: saleWhereClause,
            include: {
                product: true,
                sale: {
                    select: {
                        saleDate: true,
                        invoiceNumber: true,
                        customerName: true
                    }
                }
            },
            orderBy: {
                sale: {
                    saleDate: 'asc'
                }
            }
        });
        // Combine and sort by date
        const movements = [
            ...purchaseItems.map(item => ({
                date: item.purchase.purchaseDate,
                type: 'PURCHASE',
                reference: item.purchase.invoiceNumber,
                source: item.purchase.supplier.name,
                productId: item.productId,
                productName: item.product.name,
                sku: item.product.sku,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice
            })),
            ...saleItems.map(item => ({
                date: item.sale.saleDate,
                type: 'SALE',
                reference: item.sale.invoiceNumber,
                source: item.sale.customerName || 'Walk-in Customer',
                productId: item.productId,
                productName: item.product.name,
                sku: item.product.sku,
                quantity: -item.quantity, // Negative for sales
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice
            }))
        ].sort((a, b) => a.date.getTime() - b.date.getTime());
        // Calculate summary by product
        const productSummary = movements.reduce((acc, movement) => {
            const { productId, productName, sku, quantity } = movement;
            if (!acc[productId]) {
                acc[productId] = {
                    productId,
                    productName,
                    sku,
                    purchased: 0,
                    sold: 0,
                    net: 0
                };
            }
            if (movement.type === 'PURCHASE') {
                acc[productId].purchased += quantity;
            }
            else {
                acc[productId].sold += Math.abs(quantity);
            }
            acc[productId].net += quantity;
            return acc;
        }, {});
        return {
            movements,
            summary: Object.values(productSummary)
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new utils_1.AppError(`Error generating inventory movement report: ${errorMessage}`, 500);
    }
});
exports.getInventoryMovement = getInventoryMovement;
const getInventoryValuation = (pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany({
            where: { pharmacyId },
            select: {
                id: true,
                name: true,
                sku: true,
                category: true,
                costPrice: true,
                retailPrice: true,
                currentStock: true
            },
            orderBy: [
                { category: 'asc' },
                { name: 'asc' }
            ]
        });
        const valuation = products.map(product => {
            const costValue = product.costPrice * product.currentStock;
            const retailValue = product.retailPrice * product.currentStock;
            const potentialProfit = retailValue - costValue;
            return Object.assign(Object.assign({}, product), { costValue,
                retailValue,
                potentialProfit, profitMargin: costValue > 0 ? (potentialProfit / costValue) * 100 : 0 });
        });
        // Calculate summary by category
        const categorySummary = valuation.reduce((acc, item) => {
            const { category, costValue, retailValue, potentialProfit } = item;
            if (!acc[category]) {
                acc[category] = {
                    category,
                    costValue: 0,
                    retailValue: 0,
                    potentialProfit: 0,
                    productCount: 0
                };
            }
            acc[category].costValue += costValue;
            acc[category].retailValue += retailValue;
            acc[category].potentialProfit += potentialProfit;
            acc[category].productCount += 1;
            return acc;
        }, {});
        // Calculate totals
        const totalCostValue = valuation.reduce((sum, item) => sum + item.costValue, 0);
        const totalRetailValue = valuation.reduce((sum, item) => sum + item.retailValue, 0);
        const totalPotentialProfit = valuation.reduce((sum, item) => sum + item.potentialProfit, 0);
        return {
            products: valuation,
            categorySummary: Object.values(categorySummary),
            totals: {
                costValue: totalCostValue,
                retailValue: totalRetailValue,
                potentialProfit: totalPotentialProfit,
                profitMargin: totalCostValue > 0 ? (totalPotentialProfit / totalCostValue) * 100 : 0
            }
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new utils_1.AppError(`Error generating inventory valuation: ${errorMessage}`, 500);
    }
});
exports.getInventoryValuation = getInventoryValuation;
