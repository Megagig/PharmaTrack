import { PrismaClient, Supplier } from '@prisma/client';
import { SupplierCreateInput, SupplierUpdateInput } from '../types/inventory.types';
import { AppError } from '../utils';

const prisma = new PrismaClient();

export const createSupplier = async (data: SupplierCreateInput): Promise<Supplier> => {
  try {
    return await prisma.supplier.create({
      data
    });
  } catch (error: any) {
    throw new AppError(`Error creating supplier: ${error.message}`, 500);
  }
};

export const getSuppliers = async (pharmacyId: string): Promise<Supplier[]> => {
  try {
    return await prisma.supplier.findMany({
      where: { pharmacyId },
      orderBy: { name: 'asc' }
    });
  } catch (error: any) {
    throw new AppError(`Error fetching suppliers: ${error.message}`, 500);
  }
};

export const getSupplierById = async (id: string, pharmacyId: string): Promise<Supplier> => {
  try {
    const supplier = await prisma.supplier.findFirst({
      where: { 
        id,
        pharmacyId
      }
    });

    if (!supplier) {
      throw new AppError('Supplier not found', 404);
    }

    return supplier;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error fetching supplier: ${error.message}`, 500);
  }
};

export const updateSupplier = async (
  id: string, 
  pharmacyId: string, 
  data: SupplierUpdateInput
): Promise<Supplier> => {
  try {
    // Check if supplier exists and belongs to the pharmacy
    const existingSupplier = await prisma.supplier.findFirst({
      where: { 
        id,
        pharmacyId
      }
    });

    if (!existingSupplier) {
      throw new AppError('Supplier not found', 404);
    }

    return await prisma.supplier.update({
      where: { id },
      data
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error updating supplier: ${error.message}`, 500);
  }
};

export const deleteSupplier = async (id: string, pharmacyId: string): Promise<void> => {
  try {
    // Check if supplier exists and belongs to the pharmacy
    const existingSupplier = await prisma.supplier.findFirst({
      where: { 
        id,
        pharmacyId
      }
    });

    if (!existingSupplier) {
      throw new AppError('Supplier not found', 404);
    }

    // Check if supplier has related purchases
    const purchasesCount = await prisma.purchase.count({
      where: { supplierId: id }
    });

    if (purchasesCount > 0) {
      throw new AppError('Cannot delete supplier with related purchase records', 400);
    }

    await prisma.supplier.delete({
      where: { id }
    });
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error deleting supplier: ${error.message}`, 500);
  }
};

export const getSupplierWithPurchases = async (id: string, pharmacyId: string): Promise<any> => {
  try {
    const supplier = await prisma.supplier.findFirst({
      where: { 
        id,
        pharmacyId
      },
      include: {
        purchases: {
          orderBy: {
            purchaseDate: 'desc'
          }
        }
      }
    });

    if (!supplier) {
      throw new AppError('Supplier not found', 404);
    }

    return supplier;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Error fetching supplier with purchases: ${error.message}`, 500);
  }
};

export const searchSuppliers = async (
  pharmacyId: string, 
  searchTerm: string
): Promise<Supplier[]> => {
  try {
    return await prisma.supplier.findMany({
      where: {
        pharmacyId,
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { contactName: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { phone: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      orderBy: { name: 'asc' }
    });
  } catch (error: any) {
    throw new AppError(`Error searching suppliers: ${error.message}`, 500);
  }
};
