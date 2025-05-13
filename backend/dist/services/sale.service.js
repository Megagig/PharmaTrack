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
exports.getSalesReport = exports.deleteSale = exports.updateSale = exports.getSaleById = exports.getSales = exports.createSale = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../utils");
const prisma = new client_1.PrismaClient();
const createSale = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Start a transaction
        return yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Create the sale
            const sale = yield tx.sale.create({
                data: {
                    invoiceNumber: data.invoiceNumber,
                    saleDate: data.saleDate,
                    customerName: data.customerName,
                    customerPhone: data.customerPhone,
                    customerEmail: data.customerEmail,
                    totalAmount: data.totalAmount,
                    discount: data.discount,
                    tax: data.tax,
                    paymentStatus: data.paymentStatus,
                    paymentMethod: data.paymentMethod,
                    notes: data.notes,
                    pharmacyId: data.pharmacyId
                }
            });
            // Create sale items
            for (const item of data.items) {
                const saleItem = yield tx.saleItem.create({
                    data: {
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice || item.quantity * item.unitPrice,
                        discount: item.discount || 0,
                        saleId: sale.id,
                        productId: item.productId,
                        batchItemId: item.batchItemId
                    }
                });
                // Update batch item quantity if specified
                if (item.batchItemId) {
                    const batchItem = yield tx.batchItem.findUnique({
                        where: { id: item.batchItemId }
                    });
                    if (!batchItem) {
                        throw new utils_1.AppError(`Batch item not found: ${item.batchItemId}`, 404);
                    }
                    if (batchItem.currentQuantity < item.quantity) {
                        throw new utils_1.AppError(`Insufficient quantity in batch ${batchItem.batchNumber}`, 400);
                    }
                    yield tx.batchItem.update({
                        where: { id: item.batchItemId },
                        data: {
                            currentQuantity: {
                                decrement: item.quantity
                            }
                        }
                    });
                }
                // Update product stock
                const product = yield tx.product.findUnique({
                    where: { id: item.productId }
                });
                if (!product) {
                    throw new utils_1.AppError(`Product not found: ${item.productId}`, 404);
                }
                if (product.currentStock < item.quantity) {
                    throw new utils_1.AppError(`Insufficient stock for product: ${product.name}`, 400);
                }
                yield tx.product.update({
                    where: { id: item.productId },
                    data: {
                        currentStock: {
                            decrement: item.quantity
                        }
                    }
                });
            }
            // Create transaction record
            yield tx.transaction.create({
                data: {
                    date: data.saleDate,
                    amount: data.totalAmount,
                    type: client_1.TransactionType.INCOME,
                    description: `Sale Invoice #${data.invoiceNumber}`,
                    pharmacyId: data.pharmacyId,
                    saleId: sale.id
                }
            });
            return sale;
        }));
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error creating sale: ${error.message}`, 500);
    }
});
exports.createSale = createSale;
const getSales = (pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.sale.findMany({
            where: { pharmacyId },
            orderBy: { saleDate: 'desc' }
        });
    }
    catch (error) {
        throw new utils_1.AppError(`Error fetching sales: ${error.message}`, 500);
    }
});
exports.getSales = getSales;
const getSaleById = (id, pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sale = yield prisma.sale.findFirst({
            where: {
                id,
                pharmacyId
            },
            include: {
                saleItems: {
                    include: {
                        product: true,
                        batchItem: true
                    }
                }
            }
        });
        if (!sale) {
            throw new utils_1.AppError('Sale not found', 404);
        }
        return sale;
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error fetching sale: ${error.message}`, 500);
    }
});
exports.getSaleById = getSaleById;
const updateSale = (id, pharmacyId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Start a transaction
        return yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Check if sale exists and belongs to the pharmacy
            const existingSale = yield tx.sale.findFirst({
                where: {
                    id,
                    pharmacyId
                },
                include: {
                    saleItems: {
                        include: {
                            batchItem: true
                        }
                    }
                }
            });
            if (!existingSale) {
                throw new utils_1.AppError('Sale not found', 404);
            }
            // Update sale basic info
            const updatedSale = yield tx.sale.update({
                where: { id },
                data: {
                    invoiceNumber: data.invoiceNumber,
                    saleDate: data.saleDate,
                    customerName: data.customerName,
                    customerPhone: data.customerPhone,
                    customerEmail: data.customerEmail,
                    totalAmount: data.totalAmount,
                    discount: data.discount,
                    tax: data.tax,
                    paymentStatus: data.paymentStatus,
                    paymentMethod: data.paymentMethod,
                    notes: data.notes
                }
            });
            // If items are provided, update them
            if (data.items && data.items.length > 0) {
                // First, revert the stock changes from existing items
                for (const item of existingSale.saleItems) {
                    // Restore batch item quantity if it was used
                    if (item.batchItemId) {
                        yield tx.batchItem.update({
                            where: { id: item.batchItemId },
                            data: {
                                currentQuantity: {
                                    increment: item.quantity
                                }
                            }
                        });
                    }
                    // Restore product stock
                    yield tx.product.update({
                        where: { id: item.productId },
                        data: {
                            currentStock: {
                                increment: item.quantity
                            }
                        }
                    });
                }
                // Delete existing sale items
                yield tx.saleItem.deleteMany({
                    where: { saleId: id }
                });
                // Create new sale items
                for (const item of data.items) {
                    yield tx.saleItem.create({
                        data: {
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            totalPrice: item.totalPrice || item.quantity * item.unitPrice,
                            discount: item.discount || 0,
                            saleId: id,
                            productId: item.productId,
                            batchItemId: item.batchItemId
                        }
                    });
                    // Update batch item quantity if specified
                    if (item.batchItemId) {
                        const batchItem = yield tx.batchItem.findUnique({
                            where: { id: item.batchItemId }
                        });
                        if (!batchItem) {
                            throw new utils_1.AppError(`Batch item not found: ${item.batchItemId}`, 404);
                        }
                        if (batchItem.currentQuantity < item.quantity) {
                            throw new utils_1.AppError(`Insufficient quantity in batch ${batchItem.batchNumber}`, 400);
                        }
                        yield tx.batchItem.update({
                            where: { id: item.batchItemId },
                            data: {
                                currentQuantity: {
                                    decrement: item.quantity
                                }
                            }
                        });
                    }
                    // Update product stock
                    const product = yield tx.product.findUnique({
                        where: { id: item.productId }
                    });
                    if (!product) {
                        throw new utils_1.AppError(`Product not found: ${item.productId}`, 404);
                    }
                    if (product.currentStock < item.quantity) {
                        throw new utils_1.AppError(`Insufficient stock for product: ${product.name}`, 400);
                    }
                    yield tx.product.update({
                        where: { id: item.productId },
                        data: {
                            currentStock: {
                                decrement: item.quantity
                            }
                        }
                    });
                }
            }
            // Update transaction
            const existingTransaction = yield tx.transaction.findUnique({
                where: { saleId: id }
            });
            if (existingTransaction) {
                yield tx.transaction.update({
                    where: { id: existingTransaction.id },
                    data: {
                        date: data.saleDate || existingSale.saleDate,
                        amount: data.totalAmount || existingSale.totalAmount,
                        description: `Sale Invoice #${data.invoiceNumber || existingSale.invoiceNumber}`
                    }
                });
            }
            return updatedSale;
        }));
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error updating sale: ${error.message}`, 500);
    }
});
exports.updateSale = updateSale;
const deleteSale = (id, pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Start a transaction
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Check if sale exists and belongs to the pharmacy
            const existingSale = yield tx.sale.findFirst({
                where: {
                    id,
                    pharmacyId
                },
                include: {
                    saleItems: true
                }
            });
            if (!existingSale) {
                throw new utils_1.AppError('Sale not found', 404);
            }
            // Revert stock changes
            for (const item of existingSale.saleItems) {
                // Restore batch item quantity if it was used
                if (item.batchItemId) {
                    yield tx.batchItem.update({
                        where: { id: item.batchItemId },
                        data: {
                            currentQuantity: {
                                increment: item.quantity
                            }
                        }
                    });
                }
                // Restore product stock
                yield tx.product.update({
                    where: { id: item.productId },
                    data: {
                        currentStock: {
                            increment: item.quantity
                        }
                    }
                });
            }
            // Delete related records
            yield tx.transaction.deleteMany({
                where: { saleId: id }
            });
            yield tx.saleItem.deleteMany({
                where: { saleId: id }
            });
            yield tx.sale.delete({
                where: { id }
            });
        }));
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error deleting sale: ${error.message}`, 500);
    }
});
exports.deleteSale = deleteSale;
const getSalesReport = (pharmacyId, filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, productId, category } = filters;
        // Build where clause based on filters
        const whereClause = { pharmacyId };
        if (startDate && endDate) {
            whereClause.saleDate = {
                gte: startDate,
                lte: endDate
            };
        }
        else if (startDate) {
            whereClause.saleDate = {
                gte: startDate
            };
        }
        else if (endDate) {
            whereClause.saleDate = {
                lte: endDate
            };
        }
        // Base query for sales
        let salesQuery = {
            where: whereClause,
            include: {
                saleItems: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { saleDate: 'desc' }
        };
        const sales = yield prisma.sale.findMany(salesQuery);
        // Filter sales based on product or category if specified
        let filteredSales = sales;
        if (productId) {
            filteredSales = sales.filter((sale) => sale.saleItems && sale.saleItems.some((item) => item.productId === productId));
        }
        else if (category) {
            filteredSales = sales.filter((sale) => sale.saleItems && sale.saleItems.some((item) => item.product && item.product.category === category));
        }
        // Calculate summary
        const totalSales = filteredSales.length;
        const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
        // Get top selling products
        const productMap = new Map();
        filteredSales.forEach((sale) => {
            sale.saleItems.forEach((item) => {
                const productId = item.productId;
                const productName = item.product.name;
                if (!productMap.has(productId)) {
                    productMap.set(productId, {
                        productId,
                        productName,
                        quantitySold: 0,
                        revenue: 0
                    });
                }
                const productData = productMap.get(productId);
                productData.quantitySold += item.quantity;
                productData.revenue += item.totalPrice;
            });
        });
        const topSellingProducts = Array.from(productMap.values())
            .sort((a, b) => b.quantitySold - a.quantitySold)
            .slice(0, 5);
        return {
            sales: filteredSales,
            summary: {
                totalSales,
                totalRevenue,
                averageOrderValue,
                topSellingProducts
            }
        };
    }
    catch (error) {
        throw new utils_1.AppError(`Error generating sales report: ${error.message}`, 500);
    }
});
exports.getSalesReport = getSalesReport;
