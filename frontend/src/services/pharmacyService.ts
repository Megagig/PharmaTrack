import api from './api';

// Types
export interface Pharmacy {
  id: string;
  name: string;
  pharmacistInCharge: string;
  pcnLicenseNumber: string;
  phoneNumber: string;
  email?: string;
  address: string;
  ward: string;
  lga: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PharmacyCreateRequest {
  name: string;
  pharmacistInCharge: string;
  pcnLicenseNumber: string;
  phoneNumber: string;
  email?: string;
  address: string;
  ward: string;
  lga: string;
}

export interface PharmacyUpdateRequest {
  name?: string;
  pharmacistInCharge?: string;
  pcnLicenseNumber?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  ward?: string;
  lga?: string;
}

// API calls
export const pharmacyService = {
  // Get all pharmacies (for executives/admins)
  getAllPharmacies: async (): Promise<Pharmacy[]> => {
    const response = await api.get<Pharmacy[]>('/pharmacies');
    return response.data;
  },

  // Get pharmacy by ID
  getPharmacyById: async (id: string): Promise<Pharmacy> => {
    const response = await api.get<Pharmacy>(`/pharmacies/${id}`);
    return response.data;
  },

  // Create new pharmacy
  createPharmacy: async (data: PharmacyCreateRequest): Promise<Pharmacy> => {
    const response = await api.post<Pharmacy>('/pharmacies', data);
    return response.data;
  },

  // Update pharmacy
  updatePharmacy: async (id: string, data: PharmacyUpdateRequest): Promise<Pharmacy> => {
    const response = await api.put<Pharmacy>(`/pharmacies/${id}`, data);
    return response.data;
  },

  // Delete pharmacy (admin only)
  deletePharmacy: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/pharmacies/${id}`);
    return response.data;
  },

  // Get pharmacies by LGA
  getPharmaciesByLGA: async (lga: string): Promise<Pharmacy[]> => {
    const response = await api.get<Pharmacy[]>(`/pharmacies/lga/${lga}`);
    return response.data;
  },

  // Get pharmacies by ward
  getPharmaciesByWard: async (ward: string): Promise<Pharmacy[]> => {
    const response = await api.get<Pharmacy[]>(`/pharmacies/ward/${ward}`);
    return response.data;
  },
};
