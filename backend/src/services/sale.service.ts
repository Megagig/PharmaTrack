import { PrismaClient, Sale, SaleItem, TransactionType } from '@prisma/client';
import { SaleCreateInput, SaleUpdateInput, SalesReportFilters } from '../types/inventory.types';
import { AppError } from '../utils';

const prisma = new PrismaClient();

export const createSale = async (data: SaleCreateInput): Promise<Sale> => {
  try {
    // Start a transaction
    return await prisma.$transaction(async (tx) => {
      // Create the sale
      const sale = await tx.sale.create({
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
        const saleItem = await tx.saleItem.create({
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
          const batchItem = await tx.batchItem.findUnique({
            where: { id: item.batchItemId }
          });

          if (!batchItem) {
            throw new AppError(`Batch item not found: ${item.batchItemId}`, 404);
          }

          if (batchItem.currentQuantity < item.quantity) {
            throw new AppError(`Insufficient quantity in batch ${batchItem.batchNumber}`, 400);
          }

          await tx.batchItem.update({
            where: { id: item.batchItemId },
            data: {
              currentQuantity: {
                decrement: item.quantity
              }
            }
          });
        }

        // Update product stock
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new AppError(`Product not found: ${item.productId}`, 404);
        }

        if (product.currentStock < item.quantity) {
          throw new AppError(`Insufficient stock for product: ${product.name}`, 400);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: {
              decrement: item.quantity
            }
          }
        });
      }

      // Create transaction record
      await tx.transaction.create({
        data: {
          date: data.saleDate,
          amount: data.totalAmount,
          type: TransactionType.INCOME,
          description: `Sale Invoice #${data.invoiceNumber}`,
          pharmacyId: data.pharmacyId,
          saleId: sale.id
        }
      });

      return sale;
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error creating sale: ${error.message}`, 500);
  }
};

export const getSales = async (pharmacyId: string): Promise<Sale[]> => {
  try {
    return await prisma.sale.findMany({
      where: { pharmacyId },
      orderBy: { saleDate: 'desc' }
    });
  } catch (error: any) {
    throw new AppError(`Error fetching sales: ${error.message}`, 500);
  }
};

export const getSaleById = async (id: string, pharmacyId: string): Promise<any> => {
  try {
    const sale = await prisma.sale.findFirst({
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
      throw new AppError('Sale not found', 404);
    }

    return sale;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error fetching sale: ${error.message}`, 500);
  }
};

export const updateSale = async (
  id: string, 
  pharmacyId: string, 
  data: SaleUpdateInput
): Promise<Sale> => {
  try {
    // Start a transaction
    return await prisma.$transaction(async (tx) => {
      // Check if sale exists and belongs to the pharmacy
      const existingSale = await tx.sale.findFirst({
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
        throw new AppError('Sale not found', 404);
      }

      // Update sale basic info
      const updatedSale = await tx.sale.update({
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
            await tx.batchItem.update({
              where: { id: item.batchItemId },
              data: {
                currentQuantity: {
                  increment: item.quantity
                }
              }
            });
          }

          // Restore product stock
          await tx.product.update({
            where: { id: item.productId },
            data: {
              currentStock: {
                increment: item.quantity
              }
            }
          });
        }

        // Delete existing sale items
        await tx.saleItem.deleteMany({
          where: { saleId: id }
        });

        // Create new sale items
        for (const item of data.items) {
          await tx.saleItem.create({
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
            const batchItem = await tx.batchItem.findUnique({
              where: { id: item.batchItemId }
            });

            if (!batchItem) {
              throw new AppError(`Batch item not found: ${item.batchItemId}`, 404);
            }

            if (batchItem.currentQuantity < item.quantity) {
              throw new AppError(`Insufficient quantity in batch ${batchItem.batchNumber}`, 400);
            }

            await tx.batchItem.update({
              where: { id: item.batchItemId },
              data: {
                currentQuantity: {
                  decrement: item.quantity
                }
              }
            });
          }

          // Update product stock
          const product = await tx.product.findUnique({
            where: { id: item.productId }
          });

          if (!product) {
            throw new AppError(`Product not found: ${item.productId}`, 404);
          }

          if (product.currentStock < item.quantity) {
            throw new AppError(`Insufficient stock for product: ${product.name}`, 400);
          }

          await tx.product.update({
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
      const existingTransaction = await tx.transaction.findUnique({
        where: { saleId: id }
      });

      if (existingTransaction) {
        await tx.transaction.update({
          where: { id: existingTransaction.id },
          data: {
            date: data.saleDate || existingSale.saleDate,
            amount: data.totalAmount || existingSale.totalAmount,
            description: `Sale Invoice #${data.invoiceNumber || existingSale.invoiceNumber}`
          }
        });
      }

      return updatedSale;
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error updating sale: ${error.message}`, 500);
  }
};

export const deleteSale = async (id: string, pharmacyId: string): Promise<void> => {
  try {
    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Check if sale exists and belongs to the pharmacy
      const existingSale = await tx.sale.findFirst({
        where: { 
          id,
          pharmacyId
        },
        include: {
          saleItems: true
        }
      });

      if (!existingSale) {
        throw new AppError('Sale not found', 404);
      }

      // Revert stock changes
      for (const item of existingSale.saleItems) {
        // Restore batch item quantity if it was used
        if (item.batchItemId) {
          await tx.batchItem.update({
            where: { id: item.batchItemId },
            data: {
              currentQuantity: {
                increment: item.quantity
              }
            }
          });
        }

        // Restore product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: {
              increment: item.quantity
            }
          }
        });
      }

      // Delete related records
      await tx.transaction.deleteMany({
        where: { saleId: id }
      });

      await tx.saleItem.deleteMany({
        where: { saleId: id }
      });

      await tx.sale.delete({
        where: { id }
      });
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error deleting sale: ${error.message}`, 500);
  }
};

export const getSalesReport = async (
  pharmacyId: string,
  filters: SalesReportFilters
): Promise<any> => {
  try {
    const { startDate, endDate, productId, category } = filters;

    // Build where clause based on filters
    const whereClause: any = { pharmacyId };

    if (startDate && endDate) {
      whereClause.saleDate = {
        gte: startDate,
        lte: endDate
      };
    } else if (startDate) {
      whereClause.saleDate = {
        gte: startDate
      };
    } else if (endDate) {
      whereClause.saleDate = {
        lte: endDate
      };
    }

    // Base query for sales
    let salesQuery: any = {
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

    const sales = await prisma.sale.findMany(salesQuery);

    // Filter sales based on product or category if specified
    let filteredSales = sales;
    
    if (productId) {
      filteredSales = sales.filter((sale: any) => 
        sale.saleItems && sale.saleItems.some((item: any) => item.productId === productId)
      );
    } else if (category) {
      filteredSales = sales.filter((sale: any) => 
        sale.saleItems && sale.saleItems.some((item: any) => item.product && item.product.category === category)
      );
    }

    // Calculate summary
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Get top selling products
    const productMap = new Map();
    
    filteredSales.forEach((sale: any) => {
      sale.saleItems.forEach((item: any) => {
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
      .sort((a: any, b: any) => b.quantitySold - a.quantitySold)
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
  } catch (error: any) {
    throw new AppError(`Error generating sales report: ${error.message}`, 500);
  }
};
