import { apiService } from './apiService';
import { Product } from './productService';

// Define types
export interface PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  batchNumber?: string;
  expiryDate?: Date | null;
}

export interface Purchase {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplierName?: string;
  purchaseDate: Date;
  totalAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  items?: PurchaseItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseFormData {
  invoiceNumber: string;
  supplierId: string;
  purchaseDate: Date;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    batchNumber?: string;
    expiryDate?: Date | null;
  }[];
}

// Purchase service with robust error handling
export const purchaseService = {
  /**
   * Get all purchases
   * @returns Array of purchases
   */
  getAllPurchases: async (): Promise<Purchase[]> => {
    try {
      const response = await apiService.get('/purchases');
      
      if (response && response.data && Array.isArray(response.data.purchases)) {
        return response.data.purchases;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data.purchases)) {
        return response.data.data.purchases;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
      throw error;
    }
  },

  /**
   * Get a purchase by ID
   * @param id Purchase ID
   * @returns Purchase object
   */
  getPurchaseById: async (id: string): Promise<Purchase> => {
    try {
      const response = await apiService.get(`/purchases/${id}`);
      
      if (response && response.data && response.data.purchase) {
        return response.data.purchase;
      } else if (response && response.data && response.data.data && response.data.data.purchase) {
        return response.data.data.purchase;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error(`Error fetching purchase with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new purchase
   * @param purchase Purchase data
   * @returns Created purchase
   */
  createPurchase: async (purchase: PurchaseFormData): Promise<Purchase> => {
    try {
      const response = await apiService.post('/purchases', purchase);
      
      if (response && response.data && response.data.purchase) {
        return response.data.purchase;
      } else if (response && response.data && response.data.data && response.data.data.purchase) {
        return response.data.data.purchase;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error creating purchase:', error);
      throw error;
    }
  },

  /**
   * Update a purchase
   * @param id Purchase ID
   * @param purchase Purchase data
   * @returns Updated purchase
   */
  updatePurchase: async (id: string, purchase: Partial<PurchaseFormData>): Promise<Purchase> => {
    try {
      const response = await apiService.put(`/purchases/${id}`, purchase);
      
      if (response && response.data && response.data.purchase) {
        return response.data.purchase;
      } else if (response && response.data && response.data.data && response.data.data.purchase) {
        return response.data.data.purchase;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error(`Error updating purchase with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a purchase
   * @param id Purchase ID
   */
  deletePurchase: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/purchases/${id}`);
    } catch (error) {
      console.error(`Error deleting purchase with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get recent purchases
   * @param limit Number of purchases to return
   * @returns Array of recent purchases
   */
  getRecentPurchases: async (limit: number = 5): Promise<Purchase[]> => {
    try {
      const response = await apiService.get(`/purchases/recent?limit=${limit}`);
      
      if (response && response.data && Array.isArray(response.data.purchases)) {
        return response.data.purchases;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data.purchases)) {
        return response.data.data.purchases;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching recent purchases:', error);
      throw error;
    }
  }
};
