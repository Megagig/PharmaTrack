import { apiService } from './apiService';
import { Product } from './productService';

// Define types
export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
}

export interface Sale {
  id: string;
  receiptNumber: string;
  customerName?: string;
  customerPhone?: string;
  saleDate: Date;
  totalAmount: number;
  discount?: number;
  amountPaid: number;
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER';
  status: 'COMPLETED' | 'CANCELLED' | 'RETURNED';
  notes?: string;
  items?: SaleItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleFormData {
  receiptNumber?: string;
  customerName?: string;
  customerPhone?: string;
  saleDate: Date;
  discount?: number;
  amountPaid: number;
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER';
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
}

// Sale service with robust error handling
export const saleService = {
  /**
   * Get all sales
   * @returns Array of sales
   */
  getAllSales: async (): Promise<Sale[]> => {
    try {
      const response = await apiService.get('/sales');
      
      if (response && response.data && Array.isArray(response.data.sales)) {
        return response.data.sales;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data.sales)) {
        return response.data.data.sales;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  },

  /**
   * Get a sale by ID
   * @param id Sale ID
   * @returns Sale object
   */
  getSaleById: async (id: string): Promise<Sale> => {
    try {
      const response = await apiService.get(`/sales/${id}`);
      
      if (response && response.data && response.data.sale) {
        return response.data.sale;
      } else if (response && response.data && response.data.data && response.data.data.sale) {
        return response.data.data.sale;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error(`Error fetching sale with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new sale
   * @param sale Sale data
   * @returns Created sale
   */
  createSale: async (sale: SaleFormData): Promise<Sale> => {
    try {
      const response = await apiService.post('/sales', sale);
      
      if (response && response.data && response.data.sale) {
        return response.data.sale;
      } else if (response && response.data && response.data.data && response.data.data.sale) {
        return response.data.data.sale;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  },

  /**
   * Update a sale
   * @param id Sale ID
   * @param sale Sale data
   * @returns Updated sale
   */
  updateSale: async (id: string, sale: Partial<SaleFormData>): Promise<Sale> => {
    try {
      const response = await apiService.put(`/sales/${id}`, sale);
      
      if (response && response.data && response.data.sale) {
        return response.data.sale;
      } else if (response && response.data && response.data.data && response.data.data.sale) {
        return response.data.data.sale;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error(`Error updating sale with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a sale
   * @param id Sale ID
   */
  deleteSale: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/sales/${id}`);
    } catch (error) {
      console.error(`Error deleting sale with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get recent sales
   * @param limit Number of sales to return
   * @returns Array of recent sales
   */
  getRecentSales: async (limit: number = 5): Promise<Sale[]> => {
    try {
      const response = await apiService.get(`/sales/recent?limit=${limit}`);
      
      if (response && response.data && Array.isArray(response.data.sales)) {
        return response.data.sales;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data.sales)) {
        return response.data.data.sales;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching recent sales:', error);
      throw error;
    }
  },

  /**
   * Get sales statistics
   * @returns Sales statistics
   */
  getSalesStatistics: async (): Promise<any> => {
    try {
      const response = await apiService.get('/sales/statistics');
      
      if (response && response.data && response.data.statistics) {
        return response.data.statistics;
      } else if (response && response.data && response.data.data && response.data.data.statistics) {
        return response.data.data.statistics;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching sales statistics:', error);
      throw error;
    }
  }
};
