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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPurchaseReport = exports.deletePurchase = exports.updatePurchase = exports.getPurchaseById = exports.getPurchases = exports.createPurchase = void 0;
const client_1 = require("@prisma/client");
const appError_1 = __importDefault(require("../utils/appError"));
const prisma = new client_1.PrismaClient();
const createPurchase = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Start a transaction
        return yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Create the purchase
            const purchase = yield tx.purchase.create({
                data: {
                    invoiceNumber: data.invoiceNumber,
                    purchaseDate: data.purchaseDate,
                    totalAmount: data.totalAmount,
                    paymentStatus: data.paymentStatus,
                    paymentMethod: data.paymentMethod,
                    notes: data.notes,
                    supplierId: data.supplierId,
                    pharmacyId: data.pharmacyId
                }
            });
            // Create purchase items
            for (const item of data.items) {
                const purchaseItem = yield tx.purchaseItem.create({
                    data: {
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice || item.quantity * item.unitPrice,
                        batchNumber: item.batchNumber,
                        expiryDate: item.expiryDate,
                        purchaseId: purchase.id,
                        productId: item.productId
                    }
                });
                // Create batch item if batch number and expiry date are provided
                if (item.batchNumber && item.expiryDate) {
                    yield tx.batchItem.create({
                        data: {
                            batchNumber: item.batchNumber,
                            expiryDate: item.expiryDate,
                            initialQuantity: item.quantity,
                            currentQuantity: item.quantity,
                            productId: item.productId,
                            purchaseItemId: purchaseItem.id
                        }
                    });
                }
                // Update product stock
                yield tx.product.update({
                    where: { id: item.productId },
                    data: {
                        currentStock: {
                            increment: item.quantity
                        }
                    }
                });
            }
            // Create transaction record if payment is made
            if (data.paymentStatus === 'PAID' || data.paymentStatus === 'PARTIAL') {
                yield tx.transaction.create({
                    data: {
                        date: data.purchaseDate,
                        amount: data.totalAmount,
                        type: client_1.TransactionType.EXPENSE,
                        description: `Purchase Invoice #${data.invoiceNumber}`,
                        pharmacyId: data.pharmacyId,
                        purchaseId: purchase.id
                    }
                });
            }
            return purchase;
        }));
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new appError_1.default(`Error creating purchase: ${errorMessage}`, 500);
    }
});
exports.createPurchase = createPurchase;
const getPurchases = (pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.purchase.findMany({
            where: { pharmacyId },
            include: {
                supplier: true
            },
            orderBy: { purchaseDate: 'desc' }
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new appError_1.default(`Error fetching purchases: ${errorMessage}`, 500);
    }
});
exports.getPurchases = getPurchases;
const getPurchaseById = (id, pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchase = yield prisma.purchase.findFirst({
            where: {
                id,
                pharmacyId
            },
            include: {
                supplier: true,
                purchaseItems: {
                    include: {
                        product: true,
                        batchItems: true
                    }
                }
            }
        });
        if (!purchase) {
            throw new appError_1.default('Purchase not found', 404);
        }
        return purchase;
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            throw error;
        }
        else {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new appError_1.default(`Error fetching purchase: ${errorMessage}`, 500);
        }
    }
});
exports.getPurchaseById = getPurchaseById;
const updatePurchase = (id, pharmacyId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Start a transaction
        return yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Check if purchase exists and belongs to the pharmacy
            const existingPurchase = yield tx.purchase.findFirst({
                where: {
                    id,
                    pharmacyId
                },
                include: {
                    purchaseItems: true
                }
            });
            if (!existingPurchase) {
                throw new appError_1.default('Purchase not found', 404);
            }
            // Update purchase basic info
            const updatedPurchase = yield tx.purchase.update({
                where: { id },
                data: {
                    invoiceNumber: data.invoiceNumber,
                    purchaseDate: data.purchaseDate,
                    totalAmount: data.totalAmount,
                    paymentStatus: data.paymentStatus,
                    paymentMethod: data.paymentMethod,
                    notes: data.notes,
                    supplierId: data.supplierId
                }
            });
            // If items are provided, update them
            if (data.items && data.items.length > 0) {
                // First, revert the stock changes from existing items
                for (const item of existingPurchase.purchaseItems) {
                    yield tx.product.update({
                        where: { id: item.productId },
                        data: {
                            currentStock: {
                                decrement: item.quantity
                            }
                        }
                    });
                }
                // Delete existing purchase items and batch items
                yield tx.batchItem.deleteMany({
                    where: {
                        purchaseItemId: {
                            in: existingPurchase.purchaseItems.map(item => item.id)
                        }
                    }
                });
                yield tx.purchaseItem.deleteMany({
                    where: { purchaseId: id }
                });
                // Create new purchase items
                for (const item of data.items) {
                    const purchaseItem = yield tx.purchaseItem.create({
                        data: {
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            totalPrice: item.totalPrice || item.quantity * item.unitPrice,
                            batchNumber: item.batchNumber,
                            expiryDate: item.expiryDate,
                            purchaseId: id,
                            productId: item.productId
                        }
                    });
                    // Create batch item if batch number and expiry date are provided
                    if (item.batchNumber && item.expiryDate) {
                        yield tx.batchItem.create({
                            data: {
                                batchNumber: item.batchNumber,
                                expiryDate: item.expiryDate,
                                initialQuantity: item.quantity,
                                currentQuantity: item.quantity,
                                productId: item.productId,
                                purchaseItemId: purchaseItem.id
                            }
                        });
                    }
                    // Update product stock
                    yield tx.product.update({
                        where: { id: item.productId },
                        data: {
                            currentStock: {
                                increment: item.quantity
                            }
                        }
                    });
                }
            }
            // Update transaction if payment status changed
            const existingTransaction = yield tx.transaction.findUnique({
                where: { purchaseId: id }
            });
            if (data.paymentStatus === 'PAID' || data.paymentStatus === 'PARTIAL') {
                if (existingTransaction) {
                    // Update existing transaction
                    yield tx.transaction.update({
                        where: { id: existingTransaction.id },
                        data: {
                            date: data.purchaseDate || existingPurchase.purchaseDate,
                            amount: data.totalAmount || existingPurchase.totalAmount
                        }
                    });
                }
                else {
                    // Create new transaction
                    yield tx.transaction.create({
                        data: {
                            date: data.purchaseDate || existingPurchase.purchaseDate,
                            amount: data.totalAmount || existingPurchase.totalAmount,
                            type: client_1.TransactionType.EXPENSE,
                            description: `Purchase Invoice #${data.invoiceNumber || existingPurchase.invoiceNumber}`,
                            pharmacyId: pharmacyId,
                            purchaseId: id
                        }
                    });
                }
            }
            else if (existingTransaction && (data.paymentStatus === 'PENDING' || data.paymentStatus === 'CANCELLED')) {
                // Delete transaction if payment status changed to PENDING or CANCELLED
                yield tx.transaction.delete({
                    where: { id: existingTransaction.id }
                });
            }
            return updatedPurchase;
        }));
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            throw error;
        }
        else {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new appError_1.default(`Error updating purchase: ${errorMessage}`, 500);
        }
    }
});
exports.updatePurchase = updatePurchase;
const deletePurchase = (id, pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Start a transaction
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Check if purchase exists and belongs to the pharmacy
            const existingPurchase = yield tx.purchase.findFirst({
                where: {
                    id,
                    pharmacyId
                },
                include: {
                    purchaseItems: true
                }
            });
            if (!existingPurchase) {
                throw new appError_1.default('Purchase not found', 404);
            }
            // Revert stock changes
            for (const item of existingPurchase.purchaseItems) {
                yield tx.product.update({
                    where: { id: item.productId },
                    data: {
                        currentStock: {
                            decrement: item.quantity
                        }
                    }
                });
            }
            // Delete related records
            yield tx.transaction.deleteMany({
                where: { purchaseId: id }
            });
            yield tx.batchItem.deleteMany({
                where: {
                    purchaseItemId: {
                        in: existingPurchase.purchaseItems.map(item => item.id)
                    }
                }
            });
            yield tx.purchaseItem.deleteMany({
                where: { purchaseId: id }
            });
            yield tx.purchase.delete({
                where: { id }
            });
        }));
    }
    catch (error) {
        if (error instanceof appError_1.default)
            throw error;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new appError_1.default(`Error deleting purchase: ${errorMessage}`, 500);
    }
});
exports.deletePurchase = deletePurchase;
const getPurchaseReport = (pharmacyId, filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, supplierId, productId } = filters;
        // Build where clause based on filters
        const whereClause = { pharmacyId };
        if (startDate && endDate) {
            whereClause.purchaseDate = {
                gte: startDate,
                lte: endDate
            };
        }
        else if (startDate) {
            whereClause.purchaseDate = {
                gte: startDate
            };
        }
        else if (endDate) {
            whereClause.purchaseDate = {
                lte: endDate
            };
        }
        if (supplierId) {
            whereClause.supplierId = supplierId;
        }
        // Base query for purchases
        let purchasesQuery = {
            where: whereClause,
            include: {
                supplier: true
            },
            orderBy: { purchaseDate: 'desc' }
        };
        // If filtering by product, we need to include purchase items
        if (productId) {
            purchasesQuery = {
                where: whereClause,
                include: {
                    supplier: true,
                    purchaseItems: {
                        where: {
                            productId
                        },
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: { purchaseDate: 'desc' }
            };
        }
        const purchases = yield prisma.purchase.findMany(purchasesQuery);
        // For purchases with product filtering, we need to include purchase items in the query
        // Since we don't have direct access to purchaseItems in the purchase object,
        // we'll modify our approach to handle this case
        const filteredPurchases = productId
            ? yield prisma.purchase.findMany({
                where: Object.assign(Object.assign({}, whereClause), { purchaseItems: {
                        some: {
                            productId
                        }
                    } })
            })
            : purchases;
        // Calculate summary
        const totalPurchases = filteredPurchases.length;
        const totalAmount = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
        const averagePurchaseValue = totalPurchases > 0 ? totalAmount / totalPurchases : 0;
        // Get top suppliers
        const supplierMap = new Map();
        // We need to fetch supplier information separately since it's not directly accessible
        const supplierIds = [...new Set(filteredPurchases.map(purchase => purchase.supplierId))];
        const suppliers = yield prisma.supplier.findMany({
            where: {
                id: { in: supplierIds }
            }
        });
        // Create a map of supplier id to supplier name for easy lookup
        const supplierNameMap = suppliers.reduce((map, supplier) => {
            map[supplier.id] = supplier.name;
            return map;
        }, {});
        filteredPurchases.forEach(purchase => {
            const supplierId = purchase.supplierId;
            const supplierName = supplierNameMap[supplierId] || 'Unknown Supplier';
            if (!supplierMap.has(supplierId)) {
                supplierMap.set(supplierId, {
                    supplierId,
                    supplierName,
                    purchaseCount: 0,
                    totalAmount: 0
                });
            }
            const supplierData = supplierMap.get(supplierId);
            supplierData.purchaseCount += 1;
            supplierData.totalAmount += purchase.totalAmount;
        });
        const topSuppliers = Array.from(supplierMap.values())
            .sort((a, b) => b.totalAmount - a.totalAmount)
            .slice(0, 5);
        return {
            purchases: filteredPurchases,
            summary: {
                totalPurchases,
                totalAmount,
                averagePurchaseValue,
                topSuppliers
            }
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new appError_1.default(`Error generating purchase report: ${errorMessage}`, 500);
    }
});
exports.getPurchaseReport = getPurchaseReport;
