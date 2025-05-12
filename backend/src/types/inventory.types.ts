import { 
  Product, 
  Supplier, 
  Purchase, 
  PurchaseItem, 
  Sale, 
  SaleItem, 
  StockAdjustment, 
  BatchItem,
  PaymentStatus,
  PaymentMethod,
  StockAdjustmentReason,
  TransactionType
} from '@prisma/client';

// Product Types
export type ProductCreateInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'currentStock'>;
export type ProductUpdateInput = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>;

// Supplier Types
export type SupplierCreateInput = Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>;
export type SupplierUpdateInput = Partial<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>;

// Purchase Types
export type PurchaseItemInput = Omit<PurchaseItem, 'id' | 'createdAt' | 'updatedAt' | 'purchaseId' | 'totalPrice'> & {
  totalPrice?: number;
};

export type PurchaseCreateInput = Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'> & {
  items: PurchaseItemInput[];
};

export type PurchaseUpdateInput = Partial<Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>> & {
  items?: PurchaseItemInput[];
};

// Sale Types
export type SaleItemInput = Omit<SaleItem, 'id' | 'createdAt' | 'updatedAt' | 'saleId' | 'totalPrice'> & {
  totalPrice?: number;
  batchItemId?: string;
};

export type SaleCreateInput = Omit<Sale, 'id' | 'createdAt' | 'updatedAt'> & {
  items: SaleItemInput[];
};

export type SaleUpdateInput = Partial<Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>> & {
  items?: SaleItemInput[];
};

// Stock Adjustment Types
export type StockAdjustmentCreateInput = Omit<StockAdjustment, 'id' | 'createdAt' | 'updatedAt'>;
export type StockAdjustmentUpdateInput = Partial<Omit<StockAdjustment, 'id' | 'createdAt' | 'updatedAt'>>;

// Batch Item Types
export type BatchItemCreateInput = Omit<BatchItem, 'id' | 'createdAt' | 'updatedAt'>;
export type BatchItemUpdateInput = Partial<Omit<BatchItem, 'id' | 'createdAt' | 'updatedAt'>>;

// Transaction Types
export interface TransactionCreateInput {
  date: Date;
  amount: number;
  type: TransactionType;
  description?: string;
  pharmacyId: string;
  purchaseId?: string;
  saleId?: string;
}

// Report Types
export interface InventoryReportFilters {
  startDate?: Date;
  endDate?: Date;
  productId?: string;
  category?: string;
}

export interface SalesReportFilters {
  startDate?: Date;
  endDate?: Date;
  productId?: string;
  category?: string;
}

export interface PurchaseReportFilters {
  startDate?: Date;
  endDate?: Date;
  supplierId?: string;
  productId?: string;
}

export interface FinancialReportFilters {
  startDate?: Date;
  endDate?: Date;
  type?: TransactionType;
}

export interface ProductStockLevel {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  status: 'NORMAL' | 'LOW' | 'OUT_OF_STOCK';
}

export interface ProductExpiryInfo {
  id: string;
  name: string;
  sku: string;
  batchNumber: string;
  expiryDate: Date;
  currentQuantity: number;
  daysToExpiry: number;
  status: 'EXPIRED' | 'EXPIRING_SOON' | 'NORMAL';
}

export interface SalesSummary {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingProducts: {
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }[];
}

export interface PurchaseSummary {
  totalPurchases: number;
  totalCost: number;
  averagePurchaseValue: number;
  topSuppliers: {
    supplierId: string;
    supplierName: string;
    purchaseCount: number;
    totalAmount: number;
  }[];
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
}

export interface InventorySummary {
  totalProducts: number;
  lowStockProducts: number;
  expiringProducts: number;
  totalSuppliers: number;
  purchasesThisMonth: number;
  salesThisMonth: number;
  inventoryValue: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: 'PURCHASE' | 'SALE';
    date: Date;
    amount: number;
    reference: string;
  }>;
}
