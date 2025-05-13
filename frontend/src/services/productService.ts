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

// Default mock products for fallback
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    sku: 'PCM500',
    category: 'Analgesic',
    currentStock: 250,
    reorderLevel: 50,
    costPrice: 200,
    retailPrice: 250,
    expiryDate: new Date('2024-06-15'),
    description: 'Pain reliever and fever reducer',
    dosageForm: 'Tablet',
    strength: '500mg',
    manufacturer: 'GSK',
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    sku: 'AMX250',
    category: 'Antibiotic',
    currentStock: 120,
    reorderLevel: 30,
    costPrice: 350,
    retailPrice: 450,
    expiryDate: new Date('2024-03-20'),
    dosageForm: 'Capsule',
    strength: '250mg',
  },
  {
    id: '3',
    name: 'Metformin 500mg',
    sku: 'MET500',
    category: 'Antidiabetic',
    currentStock: 180,
    reorderLevel: 40,
    costPrice: 300,
    retailPrice: 380,
    expiryDate: new Date('2024-08-10'),
  },
  {
    id: '4',
    name: 'Lisinopril 10mg',
    sku: 'LIS10',
    category: 'Antihypertensive',
    currentStock: 20,
    reorderLevel: 25,
    costPrice: 400,
    retailPrice: 500,
    expiryDate: new Date('2024-05-05'),
  },
  {
    id: '5',
    name: 'Salbutamol Inhaler',
    sku: 'SAL100',
    category: 'Bronchodilator',
    currentStock: 15,
    reorderLevel: 20,
    costPrice: 1200,
    retailPrice: 1500,
    expiryDate: new Date('2024-07-22'),
  },
  {
    id: '6',
    name: 'Ciprofloxacin 500mg',
    sku: 'CIP500',
    category: 'Antibiotic',
    currentStock: 0,
    reorderLevel: 30,
    costPrice: 450,
    retailPrice: 550,
    expiryDate: new Date('2024-04-18'),
  },
];

// Default mock batch items for fallback
const DEFAULT_BATCH_ITEMS = (productId: string): BatchItem[] => [
  {
    id: '1',
    batchNumber: 'B001',
    expiryDate: new Date('2024-06-15'),
    initialQuantity: 100,
    currentQuantity: 75,
    productId,
  },
  {
    id: '2',
    batchNumber: 'B002',
    expiryDate: new Date('2024-08-20'),
    initialQuantity: 200,
    currentQuantity: 175,
    productId,
  },
];

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
        console.warn('API is not available, using mock data');
        notifications.show({
          title: 'Connection Issue',
          message: 'Using demo data - server connection unavailable',
          color: 'yellow',
        });
        return DEFAULT_PRODUCTS;
      }
      
      // Try to fetch products from API
      const response = await apiService.get('/products');
      
      if (response && response.data && Array.isArray(response.data.products)) {
        return response.data.products;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data.products)) {
        return response.data.data.products;
      } else {
        console.warn('Unexpected API response format:', response);
        notifications.show({
          title: 'Data Format Issue',
          message: 'Received unexpected data format from server',
          color: 'yellow',
        });
        return DEFAULT_PRODUCTS;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      notifications.show({
        title: 'Connection Issue',
        message: 'Failed to fetch products. Using demo data.',
        color: 'yellow',
      });
      return DEFAULT_PRODUCTS;
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
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data.products)) {
        return response.data.data.products;
      } else {
        // Filter default products for expiring ones
        return DEFAULT_PRODUCTS.filter(
          p => p.expiryDate && new Date(p.expiryDate) < new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        );
      }
    } catch (error) {
      console.error('Error fetching expiring products:', error);
      // Filter default products for expiring ones
      return DEFAULT_PRODUCTS.filter(
        p => p.expiryDate && new Date(p.expiryDate) < new Date(Date.now() + days * 24 * 60 * 60 * 1000)
      );
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
      
      if (response && response.data && Array.isArray(response.data.batchItems)) {
        return response.data.batchItems;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data.batchItems)) {
        return response.data.data.batchItems;
      } else {
        return DEFAULT_BATCH_ITEMS(productId);
      }
    } catch (error) {
      console.error('Error fetching batch items:', error);
      return DEFAULT_BATCH_ITEMS(productId);
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
      } else if (response && response.data && response.data.data && response.data.data.product) {
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
  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    try {
      const response = await apiService.put(`/products/${id}`, product);
      
      if (response && response.data && response.data.product) {
        return response.data.product;
      } else if (response && response.data && response.data.data && response.data.data.product) {
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
