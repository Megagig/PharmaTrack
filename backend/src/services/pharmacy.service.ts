import { prisma } from '../server';
import { PharmacyCreateRequest } from '../types';

export class PharmacyService {
  async createPharmacy(data: PharmacyCreateRequest) {
    // Check if pharmacy with the same license number already exists
    const existingPharmacy = await prisma.pharmacy.findUnique({
      where: { pcnLicenseNumber: data.pcnLicenseNumber }
    });
    
    if (existingPharmacy) {
      throw new Error('Pharmacy with this PCN License Number already exists');
    }
    
    // Create new pharmacy
    const pharmacy = await prisma.pharmacy.create({
      data
    });
    
    return pharmacy;
  }
  
  async getPharmacyById(id: string) {
    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id }
    });
    
    if (!pharmacy) {
      throw new Error('Pharmacy not found');
    }
    
    return pharmacy;
  }
  
  async getAllPharmacies() {
    return await prisma.pharmacy.findMany({
      orderBy: { name: 'asc' }
    });
  }
  
  async updatePharmacy(id: string, data: Partial<PharmacyCreateRequest>) {
    // Check if pharmacy exists
    const existingPharmacy = await prisma.pharmacy.findUnique({
      where: { id }
    });
    
    if (!existingPharmacy) {
      throw new Error('Pharmacy not found');
    }
    
    // If license number is being updated, check if it's already in use
    if (data.pcnLicenseNumber && data.pcnLicenseNumber !== existingPharmacy.pcnLicenseNumber) {
      const pharmacyWithLicense = await prisma.pharmacy.findUnique({
        where: { pcnLicenseNumber: data.pcnLicenseNumber }
      });
      
      if (pharmacyWithLicense) {
        throw new Error('Pharmacy with this PCN License Number already exists');
      }
    }
    
    // Update pharmacy
    const updatedPharmacy = await prisma.pharmacy.update({
      where: { id },
      data
    });
    
    return updatedPharmacy;
  }
  
  async deletePharmacy(id: string) {
    // Check if pharmacy exists
    const existingPharmacy = await prisma.pharmacy.findUnique({
      where: { id }
    });
    
    if (!existingPharmacy) {
      throw new Error('Pharmacy not found');
    }
    
    // Delete pharmacy
    await prisma.pharmacy.delete({
      where: { id }
    });
    
    return { message: 'Pharmacy deleted successfully' };
  }
  
  async getPharmaciesByLGA(lga: string) {
    return await prisma.pharmacy.findMany({
      where: { lga },
      orderBy: { name: 'asc' }
    });
  }
  
  async getPharmaciesByWard(ward: string) {
    return await prisma.pharmacy.findMany({
      where: { ward },
      orderBy: { name: 'asc' }
    });
  }
}
