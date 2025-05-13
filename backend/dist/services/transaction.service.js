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
exports.getFinancialReport = exports.deleteTransaction = exports.updateTransaction = exports.getTransactionById = exports.getTransactions = exports.createTransaction = void 0;
const client_1 = require("@prisma/client");
const utils_1 = require("../utils");
const prisma = new client_1.PrismaClient();
const createTransaction = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.transaction.create({
            data
        });
    }
    catch (error) {
        throw new utils_1.AppError(`Error creating transaction: ${error.message}`, 500);
    }
});
exports.createTransaction = createTransaction;
const getTransactions = (pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.transaction.findMany({
            where: { pharmacyId },
            include: {
                purchase: true,
                sale: true
            },
            orderBy: { date: 'desc' }
        });
    }
    catch (error) {
        throw new utils_1.AppError(`Error fetching transactions: ${error.message}`, 500);
    }
});
exports.getTransactions = getTransactions;
const getTransactionById = (id, pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield prisma.transaction.findFirst({
            where: {
                id,
                pharmacyId
            },
            include: {
                purchase: {
                    include: {
                        supplier: true
                    }
                },
                sale: true
            }
        });
        if (!transaction) {
            throw new utils_1.AppError('Transaction not found', 404);
        }
        return transaction;
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error fetching transaction: ${error.message}`, 500);
    }
});
exports.getTransactionById = getTransactionById;
const updateTransaction = (id, pharmacyId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if transaction exists and belongs to the pharmacy
        const existingTransaction = yield prisma.transaction.findFirst({
            where: {
                id,
                pharmacyId
            }
        });
        if (!existingTransaction) {
            throw new utils_1.AppError('Transaction not found', 404);
        }
        return yield prisma.transaction.update({
            where: { id },
            data
        });
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error updating transaction: ${error.message}`, 500);
    }
});
exports.updateTransaction = updateTransaction;
const deleteTransaction = (id, pharmacyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if transaction exists and belongs to the pharmacy
        const existingTransaction = yield prisma.transaction.findFirst({
            where: {
                id,
                pharmacyId
            }
        });
        if (!existingTransaction) {
            throw new utils_1.AppError('Transaction not found', 404);
        }
        // Check if transaction is linked to a purchase or sale
        if (existingTransaction.purchaseId || existingTransaction.saleId) {
            throw new utils_1.AppError('Cannot delete transaction linked to a purchase or sale', 400);
        }
        yield prisma.transaction.delete({
            where: { id }
        });
    }
    catch (error) {
        if (error instanceof utils_1.AppError)
            throw error;
        throw new utils_1.AppError(`Error deleting transaction: ${error.message}`, 500);
    }
});
exports.deleteTransaction = deleteTransaction;
const getFinancialReport = (pharmacyId, filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, type } = filters;
        // Build where clause based on filters
        const whereClause = { pharmacyId };
        if (startDate && endDate) {
            whereClause.date = {
                gte: startDate,
                lte: endDate
            };
        }
        else if (startDate) {
            whereClause.date = {
                gte: startDate
            };
        }
        else if (endDate) {
            whereClause.date = {
                lte: endDate
            };
        }
        if (type) {
            whereClause.type = type;
        }
        const transactions = yield prisma.transaction.findMany({
            where: whereClause,
            include: {
                purchase: {
                    include: {
                        supplier: true
                    }
                },
                sale: true
            },
            orderBy: { date: 'desc' }
        });
        // Calculate summary
        const incomeTransactions = transactions.filter(t => t.type === client_1.TransactionType.INCOME);
        const expenseTransactions = transactions.filter(t => t.type === client_1.TransactionType.EXPENSE);
        const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
        const netProfit = totalIncome - totalExpenses;
        const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
        // Group transactions by month for chart data
        const monthlyData = transactions.reduce((acc, transaction) => {
            const date = new Date(transaction.date);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!acc[monthYear]) {
                acc[monthYear] = {
                    month: monthYear,
                    income: 0,
                    expenses: 0,
                    profit: 0
                };
            }
            if (transaction.type === client_1.TransactionType.INCOME) {
                acc[monthYear].income += transaction.amount;
            }
            else {
                acc[monthYear].expenses += transaction.amount;
            }
            acc[monthYear].profit = acc[monthYear].income - acc[monthYear].expenses;
            return acc;
        }, {});
        // Convert to array and sort by month
        const monthlyChartData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
        // Calculate daily data for the selected period
        const dailyData = transactions.reduce((acc, transaction) => {
            const date = new Date(transaction.date);
            const day = date.toISOString().split('T')[0]; // YYYY-MM-DD format
            if (!acc[day]) {
                acc[day] = {
                    date: day,
                    income: 0,
                    expenses: 0,
                    profit: 0
                };
            }
            if (transaction.type === client_1.TransactionType.INCOME) {
                acc[day].income += transaction.amount;
            }
            else {
                acc[day].expenses += transaction.amount;
            }
            acc[day].profit = acc[day].income - acc[day].expenses;
            return acc;
        }, {});
        // Convert to array and sort by date
        const dailyChartData = Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
        // Get expense categories (from purchase descriptions)
        const expenseCategories = expenseTransactions.reduce((acc, transaction) => {
            const category = transaction.purchase
                ? 'Inventory Purchase'
                : transaction.description || 'Other Expenses';
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += transaction.amount;
            return acc;
        }, {});
        // Convert to array for chart data
        const expenseCategoryData = Object.entries(expenseCategories).map(([category, amount]) => ({
            category,
            amount
        })).sort((a, b) => b.amount - a.amount);
        const summary = {
            totalIncome,
            totalExpenses,
            netProfit,
            profitMargin
        };
        return {
            transactions,
            summary,
            chartData: {
                monthly: monthlyChartData,
                daily: dailyChartData,
                expenseCategories: expenseCategoryData
            }
        };
    }
    catch (error) {
        throw new utils_1.AppError(`Error generating financial report: ${error.message}`, 500);
    }
});
exports.getFinancialReport = getFinancialReport;
