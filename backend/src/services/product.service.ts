import { PrismaClient, Product } from '@prisma/client';
import { ProductCreateInput, ProductUpdateInput } from '../types/inventory.types';
import { AppError } from '../utils';

const prisma = new PrismaClient();

export const createProduct = async (data: ProductCreateInput): Promise<Product> => {
  try {
    // Check if product with same SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku: data.sku }
    });

    if (existingProduct) {
      throw new AppError('Product with this SKU already exists', 400);
    }

    // Ensure expiryDate is a proper Date object
    const productData = {
      ...data,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null
    };

    return await prisma.product.create({
      data: productData
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error creating product: ${error.message}`, 500);
  }
};

export const getProducts = async (pharmacyId: string): Promise<Product[]> => {
  try {
    return await prisma.product.findMany({
      where: { pharmacyId },
      orderBy: { name: 'asc' }
    });
  } catch (error: any) {
    throw new AppError(`Error fetching products: ${error.message}`, 500);
  }
};

export const getProductById = async (id: string, pharmacyId: string): Promise<Product> => {
  try {
    const product = await prisma.product.findFirst({
      where: { 
        id,
        pharmacyId
      }
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error fetching product: ${error.message}`, 500);
  }
};

export const updateProduct = async (
  id: string, 
  pharmacyId: string, 
  data: ProductUpdateInput
): Promise<Product> => {
  try {
    // Check if product exists and belongs to the pharmacy
    const existingProduct = await prisma.product.findFirst({
      where: { 
        id,
        pharmacyId
      }
    });

    if (!existingProduct) {
      throw new AppError('Product not found', 404);
    }

    // If SKU is being updated, check if it's unique
    if (data.sku && data.sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku: data.sku }
      });

      if (skuExists) {
        throw new AppError('Product with this SKU already exists', 400);
      }
    }

    return await prisma.product.update({
      where: { id },
      data
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error updating product: ${error.message}`, 500);
  }
};

export const deleteProduct = async (id: string, pharmacyId: string): Promise<void> => {
  try {
    // Check if product exists and belongs to the pharmacy
    const existingProduct = await prisma.product.findFirst({
      where: { 
        id,
        pharmacyId
      }
    });

    if (!existingProduct) {
      throw new AppError('Product not found', 404);
    }

    // Check if product has related records
    const purchaseItems = await prisma.purchaseItem.count({
      where: { productId: id }
    });

    const saleItems = await prisma.saleItem.count({
      where: { productId: id }
    });

    if (purchaseItems > 0 || saleItems > 0) {
      throw new AppError('Cannot delete product with related purchase or sale records', 400);
    }

    await prisma.product.delete({
      where: { id }
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error deleting product: ${error.message}`, 500);
  }
};

export const getLowStockProducts = async (pharmacyId: string): Promise<Product[]> => {
  try {
    return await prisma.product.findMany({
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
  } catch (error: any) {
    throw new AppError(`Error fetching low stock products: ${error.message}`, 500);
  }
};

export const getExpiringProducts = async (
  pharmacyId: string, 
  daysThreshold: number = 90
): Promise<any[]> => {
  try {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    // Find batch items that are expiring soon
    const expiringBatches = await prisma.batchItem.findMany({
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
  } catch (error: any) {
    throw new AppError(`Error fetching expiring products: ${error.message}`, 500);
  }
};

export const searchProducts = async (
  pharmacyId: string, 
  searchTerm: string
): Promise<Product[]> => {
  try {
    return await prisma.product.findMany({
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
  } catch (error: any) {
    throw new AppError(`Error searching products: ${error.message}`, 500);
  }
};

export const getProductCategories = async (pharmacyId: string): Promise<string[]> => {
  try {
    const products = await prisma.product.findMany({
      where: { pharmacyId },
      select: { category: true },
      distinct: ['category']
    });

    return products.map(product => product.category).sort();
  } catch (error: any) {
    throw new AppError(`Error fetching product categories: ${error.message}`, 500);
  }
};

export const getProductInventoryValue = async (pharmacyId: string): Promise<number> => {
  try {
    const products = await prisma.product.findMany({
      where: { pharmacyId },
      select: {
        costPrice: true,
        currentStock: true
      }
    });

    return products.reduce((total, product) => {
      return total + (product.costPrice * product.currentStock);
    }, 0);
  } catch (error: any) {
    throw new AppError(`Error calculating inventory value: ${error.message}`, 500);
  }
};
