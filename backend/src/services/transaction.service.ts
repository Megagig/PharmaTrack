import { PrismaClient, Transaction, TransactionType } from '@prisma/client';
import { TransactionCreateInput, FinancialReportFilters, FinancialSummary } from '../types/inventory.types';
import { AppError } from '../utils';

const prisma = new PrismaClient();

export const createTransaction = async (data: TransactionCreateInput): Promise<Transaction> => {
  try {
    return await prisma.transaction.create({
      data
    });
  } catch (error: any) {
    throw new AppError(`Error creating transaction: ${error.message}`, 500);
  }
};

export const getTransactions = async (pharmacyId: string): Promise<Transaction[]> => {
  try {
    return await prisma.transaction.findMany({
      where: { pharmacyId },
      include: {
        purchase: true,
        sale: true
      },
      orderBy: { date: 'desc' }
    });
  } catch (error: any) {
    throw new AppError(`Error fetching transactions: ${error.message}`, 500);
  }
};

export const getTransactionById = async (id: string, pharmacyId: string): Promise<Transaction> => {
  try {
    const transaction = await prisma.transaction.findFirst({
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
      throw new AppError('Transaction not found', 404);
    }

    return transaction;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error fetching transaction: ${error.message}`, 500);
  }
};

export const updateTransaction = async (
  id: string, 
  pharmacyId: string, 
  data: Partial<TransactionCreateInput>
): Promise<Transaction> => {
  try {
    // Check if transaction exists and belongs to the pharmacy
    const existingTransaction = await prisma.transaction.findFirst({
      where: { 
        id,
        pharmacyId
      }
    });

    if (!existingTransaction) {
      throw new AppError('Transaction not found', 404);
    }

    return await prisma.transaction.update({
      where: { id },
      data
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error updating transaction: ${error.message}`, 500);
  }
};

export const deleteTransaction = async (id: string, pharmacyId: string): Promise<void> => {
  try {
    // Check if transaction exists and belongs to the pharmacy
    const existingTransaction = await prisma.transaction.findFirst({
      where: { 
        id,
        pharmacyId
      }
    });

    if (!existingTransaction) {
      throw new AppError('Transaction not found', 404);
    }

    // Check if transaction is linked to a purchase or sale
    if (existingTransaction.purchaseId || existingTransaction.saleId) {
      throw new AppError('Cannot delete transaction linked to a purchase or sale', 400);
    }

    await prisma.transaction.delete({
      where: { id }
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error deleting transaction: ${error.message}`, 500);
  }
};

export const getFinancialReport = async (
  pharmacyId: string,
  filters: FinancialReportFilters
): Promise<any> => {
  try {
    const { startDate, endDate, type } = filters;

    // Build where clause based on filters
    const whereClause: any = { pharmacyId };

    if (startDate && endDate) {
      whereClause.date = {
        gte: startDate,
        lte: endDate
      };
    } else if (startDate) {
      whereClause.date = {
        gte: startDate
      };
    } else if (endDate) {
      whereClause.date = {
        lte: endDate
      };
    }

    if (type) {
      whereClause.type = type;
    }

    const transactions = await prisma.transaction.findMany({
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
    const incomeTransactions = transactions.filter(t => t.type === TransactionType.INCOME);
    const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

    // Group transactions by month for chart data
    const monthlyData: Record<string, any> = transactions.reduce((acc: Record<string, any>, transaction) => {
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
      
      if (transaction.type === TransactionType.INCOME) {
        acc[monthYear].income += transaction.amount;
      } else {
        acc[monthYear].expenses += transaction.amount;
      }
      
      acc[monthYear].profit = acc[monthYear].income - acc[monthYear].expenses;
      
      return acc;
    }, {});

    // Convert to array and sort by month
    const monthlyChartData = Object.values(monthlyData).sort((a: any, b: any) => 
      a.month.localeCompare(b.month)
    );

    // Calculate daily data for the selected period
    const dailyData: Record<string, any> = transactions.reduce((acc: Record<string, any>, transaction) => {
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
      
      if (transaction.type === TransactionType.INCOME) {
        acc[day].income += transaction.amount;
      } else {
        acc[day].expenses += transaction.amount;
      }
      
      acc[day].profit = acc[day].income - acc[day].expenses;
      
      return acc;
    }, {});

    // Convert to array and sort by date
    const dailyChartData = Object.values(dailyData).sort((a: any, b: any) => 
      a.date.localeCompare(b.date)
    );

    // Get expense categories (from purchase descriptions)
    const expenseCategories: Record<string, number> = expenseTransactions.reduce((acc: Record<string, number>, transaction) => {
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

    const summary: FinancialSummary = {
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
  } catch (error: any) {
    throw new AppError(`Error generating financial report: ${error.message}`, 500);
  }
};
