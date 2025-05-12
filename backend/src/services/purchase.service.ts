import { PrismaClient, Purchase, PurchaseItem, TransactionType } from '@prisma/client';
import { PurchaseCreateInput, PurchaseUpdateInput, PurchaseReportFilters } from '../types/inventory.types';
import AppError from '../utils/appError';

const prisma = new PrismaClient();

export const createPurchase = async (data: PurchaseCreateInput): Promise<Purchase> => {
  try {
    // Start a transaction
    return await prisma.$transaction(async (tx) => {
      // Create the purchase
      const purchase = await tx.purchase.create({
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
        const purchaseItem = await tx.purchaseItem.create({
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
          await tx.batchItem.create({
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
        await tx.product.update({
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
        await tx.transaction.create({
          data: {
            date: data.purchaseDate,
            amount: data.totalAmount,
            type: TransactionType.EXPENSE,
            description: `Purchase Invoice #${data.invoiceNumber}`,
            pharmacyId: data.pharmacyId,
            purchaseId: purchase.id
          }
        });
      }

      return purchase;
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(`Error creating purchase: ${errorMessage}`, 500);
  }
};

export const getPurchases = async (pharmacyId: string): Promise<Purchase[]> => {
  try {
    return await prisma.purchase.findMany({
      where: { pharmacyId },
      include: {
        supplier: true
      },
      orderBy: { purchaseDate: 'desc' }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(`Error fetching purchases: ${errorMessage}`, 500);
  }
};

export const getPurchaseById = async (id: string, pharmacyId: string): Promise<any> => {
  try {
    const purchase = await prisma.purchase.findFirst({
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
      throw new AppError('Purchase not found', 404);
    }

    return purchase;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError(`Error fetching purchase: ${errorMessage}`, 500);
    }
  }
};

export const updatePurchase = async (
  id: string, 
  pharmacyId: string, 
  data: PurchaseUpdateInput
): Promise<Purchase> => {
  try {
    // Start a transaction
    return await prisma.$transaction(async (tx) => {
      // Check if purchase exists and belongs to the pharmacy
      const existingPurchase = await tx.purchase.findFirst({
        where: { 
          id,
          pharmacyId
        },
        include: {
          purchaseItems: true
        }
      });

      if (!existingPurchase) {
        throw new AppError('Purchase not found', 404);
      }

      // Update purchase basic info
      const updatedPurchase = await tx.purchase.update({
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
          await tx.product.update({
            where: { id: item.productId },
            data: {
              currentStock: {
                decrement: item.quantity
              }
            }
          });
        }

        // Delete existing purchase items and batch items
        await tx.batchItem.deleteMany({
          where: {
            purchaseItemId: {
              in: existingPurchase.purchaseItems.map(item => item.id)
            }
          }
        });

        await tx.purchaseItem.deleteMany({
          where: { purchaseId: id }
        });

        // Create new purchase items
        for (const item of data.items) {
          const purchaseItem = await tx.purchaseItem.create({
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
            await tx.batchItem.create({
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
          await tx.product.update({
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
      const existingTransaction = await tx.transaction.findUnique({
        where: { purchaseId: id }
      });

      if (data.paymentStatus === 'PAID' || data.paymentStatus === 'PARTIAL') {
        if (existingTransaction) {
          // Update existing transaction
          await tx.transaction.update({
            where: { id: existingTransaction.id },
            data: {
              date: data.purchaseDate || existingPurchase.purchaseDate,
              amount: data.totalAmount || existingPurchase.totalAmount
            }
          });
        } else {
          // Create new transaction
          await tx.transaction.create({
            data: {
              date: data.purchaseDate || existingPurchase.purchaseDate,
              amount: data.totalAmount || existingPurchase.totalAmount,
              type: TransactionType.EXPENSE,
              description: `Purchase Invoice #${data.invoiceNumber || existingPurchase.invoiceNumber}`,
              pharmacyId: pharmacyId,
              purchaseId: id
            }
          });
        }
      } else if (existingTransaction && (data.paymentStatus === 'PENDING' || data.paymentStatus === 'CANCELLED')) {
        // Delete transaction if payment status changed to PENDING or CANCELLED
        await tx.transaction.delete({
          where: { id: existingTransaction.id }
        });
      }

      return updatedPurchase;
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError(`Error updating purchase: ${errorMessage}`, 500);
    }
  }
};

export const deletePurchase = async (id: string, pharmacyId: string): Promise<void> => {
  try {
    // Start a transaction
    await prisma.$transaction(async (tx) => {
      // Check if purchase exists and belongs to the pharmacy
      const existingPurchase = await tx.purchase.findFirst({
        where: { 
          id,
          pharmacyId
        },
        include: {
          purchaseItems: true
        }
      });

      if (!existingPurchase) {
        throw new AppError('Purchase not found', 404);
      }

      // Revert stock changes
      for (const item of existingPurchase.purchaseItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: {
              decrement: item.quantity
            }
          }
        });
      }

      // Delete related records
      await tx.transaction.deleteMany({
        where: { purchaseId: id }
      });

      await tx.batchItem.deleteMany({
        where: {
          purchaseItemId: {
            in: existingPurchase.purchaseItems.map(item => item.id)
          }
        }
      });

      await tx.purchaseItem.deleteMany({
        where: { purchaseId: id }
      });

      await tx.purchase.delete({
        where: { id }
      });
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(`Error deleting purchase: ${errorMessage}`, 500);
  }
};

export const getPurchaseReport = async (
  pharmacyId: string,
  filters: PurchaseReportFilters
): Promise<any> => {
  try {
    const { startDate, endDate, supplierId, productId } = filters;

    // Build where clause based on filters
    const whereClause: any = { pharmacyId };

    if (startDate && endDate) {
      whereClause.purchaseDate = {
        gte: startDate,
        lte: endDate
      };
    } else if (startDate) {
      whereClause.purchaseDate = {
        gte: startDate
      };
    } else if (endDate) {
      whereClause.purchaseDate = {
        lte: endDate
      };
    }

    if (supplierId) {
      whereClause.supplierId = supplierId;
    }

    // Base query for purchases
    let purchasesQuery: any = {
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

    const purchases = await prisma.purchase.findMany(purchasesQuery);

    // For purchases with product filtering, we need to include purchase items in the query
    // Since we don't have direct access to purchaseItems in the purchase object,
    // we'll modify our approach to handle this case
    const filteredPurchases = productId
      ? await prisma.purchase.findMany({
          where: {
            ...whereClause,
            purchaseItems: {
              some: {
                productId
              }
            }
          }
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
    const suppliers = await prisma.supplier.findMany({
      where: {
        id: { in: supplierIds }
      }
    });
    
    // Create a map of supplier id to supplier name for easy lookup
    const supplierNameMap = suppliers.reduce((map, supplier) => {
      map[supplier.id] = supplier.name;
      return map;
    }, {} as Record<string, string>);
    
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(`Error generating purchase report: ${errorMessage}`, 500);
  }
};
