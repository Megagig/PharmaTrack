import { apiService } from './apiService';
import { notifications } from '@mantine/notifications';

// Define types
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  costPrice: number;
  retailPrice: number;
  expiryDate?: Date | null;
  description?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
}

export interface BatchItem {
  id: string;
  batchNumber: string;
  expiryDate: Date;
  initialQuantity: number;
  currentQuantity: number;
  productId: string;
}

// Empty arrays for when API fails
const EMPTY_PRODUCTS: Product[] = [];
const EMPTY_BATCH_ITEMS: BatchItem[] = [];

// Product service with robust error handling and fallback mechanisms
export const productService = {
  /**
   * Get all products
   * @returns Array of products
   */
  getAllProducts: async (): Promise<Product[]> => {
    try {
      // Check API availability first
      const isApiAvailable = await apiService.checkApiAvailability();

      if (!isApiAvailable) {
        console.warn('API is not available');
        throw new Error('API is not available');
      }

      // Try to fetch products from API
      const response = await apiService.get('/products');

      if (response && response.data && Array.isArray(response.data.products)) {
        return response.data.products;
      } else if (
        response &&
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.products)
      ) {
        return response.data.data.products;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Get expiring products
   * @param days Number of days to check for expiry
   * @returns Array of expiring products
   */
  getExpiringProducts: async (days: number = 90): Promise<Product[]> => {
    try {
      const response = await apiService.get(`/products/expiring?days=${days}`);

      if (response && response.data && Array.isArray(response.data.products)) {
        return response.data.products;
      } else if (
        response &&
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.products)
      ) {
        return response.data.data.products;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching expiring products:', error);
      throw error;
    }
  },

  /**
   * Get batch items for a product
   * @param productId Product ID
   * @returns Array of batch items
   */
  getBatchItems: async (productId: string): Promise<BatchItem[]> => {
    try {
      const response = await apiService.get(`/products/${productId}/batches`);

      if (
        response &&
        response.data &&
        Array.isArray(response.data.batchItems)
      ) {
        return response.data.batchItems;
      } else if (
        response &&
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.batchItems)
      ) {
        return response.data.data.batchItems;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching batch items:', error);
      throw error;
    }
  },

  /**
   * Add a new product
   * @param product Product data
   * @returns Added product
   */
  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const response = await apiService.post('/products', product);

      if (response && response.data && response.data.product) {
        return response.data.product;
      } else if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.product
      ) {
        return response.data.data.product;
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  /**
   * Update a product
   * @param id Product ID
   * @param product Product data
   * @returns Updated product
   */
  updateProduct: async (
    id: string,
    product: Partial<Product>
  ): Promise<Product> => {
    try {
      const response = await apiService.put(`/products/${id}`, product);

      if (response && response.data && response.data.product) {
        return response.data.product;
      } else if (
        response &&
        response.data &&
        response.data.data &&
        response.data.data.product
      ) {
        return response.data.data.product;
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
};
