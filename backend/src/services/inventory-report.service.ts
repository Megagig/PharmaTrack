import { PrismaClient } from '@prisma/client';
import { InventoryReportFilters, InventorySummary, ProductStockLevel, ProductExpiryInfo } from '../types/inventory.types';
import { AppError } from '../utils';

const prisma = new PrismaClient();

export const getInventorySummary = async (pharmacyId: string): Promise<InventorySummary> => {
  try {
    // Get total products count
    const totalProducts = await prisma.product.count({
      where: { pharmacyId }
    });

    // Calculate total stock value
    const products = await prisma.product.findMany({
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
    const lowStockProducts = await prisma.product.count({
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

    const expiringProducts = await prisma.batchItem.count({
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
    const totalSuppliers = await prisma.supplier.count({
      where: { pharmacyId }
    });

    // Get purchases this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const purchasesThisMonth = await prisma.purchase.count({
      where: {
        pharmacyId,
        purchaseDate: {
          gte: startOfMonth
        }
      }
    });

    // Get sales this month
    const salesThisMonth = await prisma.sale.count({
      where: {
        pharmacyId,
        saleDate: {
          gte: startOfMonth
        }
      }
    });

    // Get top selling products
    const topSellingProducts = await prisma.saleItem.groupBy({
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
    const topProductsWithDetails = await Promise.all(
      topSellingProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, name: true }
        });

        return {
          id: product?.id || '',
          name: product?.name || 'Unknown Product',
          quantity: item._sum?.quantity || 0,
          revenue: item._sum?.totalPrice || 0
        };
      })
    );

    // Get recent transactions
    const recentPurchases = await prisma.purchase.findMany({
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

    const recentSales = await prisma.sale.findMany({
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
        type: 'PURCHASE' as const,
        date: p.purchaseDate,
        amount: p.totalAmount,
        reference: p.invoiceNumber
      })),
      ...recentSales.map(s => ({
        id: s.id,
        type: 'SALE' as const,
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(`Error generating inventory summary: ${errorMessage}`, 500);
  }
};

export const getStockLevels = async (pharmacyId: string): Promise<ProductStockLevel[]> => {
  try {
    const products = await prisma.product.findMany({
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
      let status: 'NORMAL' | 'LOW' | 'OUT_OF_STOCK' = 'NORMAL';
      
      if (product.currentStock === 0) {
        status = 'OUT_OF_STOCK';
      } else if (product.currentStock <= product.reorderLevel) {
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(`Error fetching stock levels: ${errorMessage}`, 500);
  }
};

export const getExpiryReport = async (
  pharmacyId: string,
  daysThreshold: number = 180
): Promise<ProductExpiryInfo[]> => {
  try {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    const batchItems = await prisma.batchItem.findMany({
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
      
      let status: 'EXPIRED' | 'EXPIRING_SOON' | 'NORMAL' = 'NORMAL';
      if (daysToExpiry <= 0) {
        status = 'EXPIRED';
      } else if (daysToExpiry <= 30) {
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
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(`Error generating expiry report: ${errorMessage}`, 500);
  }
};

export const getInventoryMovement = async (
  pharmacyId: string,
  filters: InventoryReportFilters
): Promise<any> => {
  try {
    const { startDate, endDate, productId, category } = filters;

    // Build where clauses based on filters
    const purchaseWhereClause: any = { 
      purchase: {
        pharmacyId
      }
    };

    const saleWhereClause: any = { 
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
    } else if (startDate) {
      purchaseWhereClause.purchase.purchaseDate = {
        gte: startDate
      };
      
      saleWhereClause.sale.saleDate = {
        gte: startDate
      };
    } else if (endDate) {
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
    const purchaseItems = await prisma.purchaseItem.findMany({
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
    const saleItems = await prisma.saleItem.findMany({
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
    const productSummary = movements.reduce((acc: Record<string, any>, movement) => {
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
      } else {
        acc[productId].sold += Math.abs(quantity);
      }
      
      acc[productId].net += quantity;
      
      return acc;
    }, {} as Record<string, any>);

    return {
      movements,
      summary: Object.values(productSummary)
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(`Error generating inventory movement report: ${errorMessage}`, 500);
  }
};

export const getInventoryValuation = async (pharmacyId: string): Promise<any> => {
  try {
    const products = await prisma.product.findMany({
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
      
      return {
        ...product,
        costValue,
        retailValue,
        potentialProfit,
        profitMargin: costValue > 0 ? (potentialProfit / costValue) * 100 : 0
      };
    });

    // Calculate summary by category
    const categorySummary = valuation.reduce((acc: Record<string, any>, item) => {
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
    }, {} as Record<string, any>);

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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(`Error generating inventory valuation: ${errorMessage}`, 500);
  }
};
