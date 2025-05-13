import { apiService } from './apiService';

// Define types
export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  notes?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierFormData {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  notes?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// Supplier service with robust error handling
export const supplierService = {
  /**
   * Get all suppliers
   * @returns Array of suppliers
   */
  getAllSuppliers: async (): Promise<Supplier[]> => {
    try {
      const response = await apiService.get('/suppliers');
      
      if (response && response.data && Array.isArray(response.data.suppliers)) {
        return response.data.suppliers;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data.suppliers)) {
        return response.data.data.suppliers;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },

  /**
   * Get a supplier by ID
   * @param id Supplier ID
   * @returns Supplier object
   */
  getSupplierById: async (id: string): Promise<Supplier> => {
    try {
      const response = await apiService.get(`/suppliers/${id}`);
      
      if (response && response.data && response.data.supplier) {
        return response.data.supplier;
      } else if (response && response.data && response.data.data && response.data.data.supplier) {
        return response.data.data.supplier;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error(`Error fetching supplier with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new supplier
   * @param supplier Supplier data
   * @returns Created supplier
   */
  createSupplier: async (supplier: SupplierFormData): Promise<Supplier> => {
    try {
      const response = await apiService.post('/suppliers', supplier);
      
      if (response && response.data && response.data.supplier) {
        return response.data.supplier;
      } else if (response && response.data && response.data.data && response.data.data.supplier) {
        return response.data.data.supplier;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },

  /**
   * Update a supplier
   * @param id Supplier ID
   * @param supplier Supplier data
   * @returns Updated supplier
   */
  updateSupplier: async (id: string, supplier: Partial<SupplierFormData>): Promise<Supplier> => {
    try {
      const response = await apiService.put(`/suppliers/${id}`, supplier);
      
      if (response && response.data && response.data.supplier) {
        return response.data.supplier;
      } else if (response && response.data && response.data.data && response.data.data.supplier) {
        return response.data.data.supplier;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error(`Error updating supplier with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a supplier
   * @param id Supplier ID
   */
  deleteSupplier: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/suppliers/${id}`);
    } catch (error) {
      console.error(`Error deleting supplier with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get active suppliers
   * @returns Array of active suppliers
   */
  getActiveSuppliers: async (): Promise<Supplier[]> => {
    try {
      const response = await apiService.get('/suppliers/active');
      
      if (response && response.data && Array.isArray(response.data.suppliers)) {
        return response.data.suppliers;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data.suppliers)) {
        return response.data.data.suppliers;
      } else {
        console.warn('Unexpected API response format:', response);
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error fetching active suppliers:', error);
      throw error;
    }
  }
};
