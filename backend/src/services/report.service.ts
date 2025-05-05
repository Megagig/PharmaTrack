import { prisma } from '../server';
import { ReportCreateRequest } from '../types';

export class ReportService {
  async createReport(pharmacyId: string, data: ReportCreateRequest) {
    // Check if pharmacy exists
    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id: pharmacyId }
    });
    
    if (!pharmacy) {
      throw new Error('Pharmacy not found');
    }
    
    // Create new report
    const report = await prisma.report.create({
      data: {
        ...data,
        pharmacyId
      }
    });
    
    return report;
  }
  
  async getReportById(id: string) {
    const report = await prisma.report.findUnique({
      where: { id },
      include: { pharmacy: true }
    });
    
    if (!report) {
      throw new Error('Report not found');
    }
    
    return report;
  }
  
  async getReportsByPharmacy(pharmacyId: string) {
    return await prisma.report.findMany({
      where: { pharmacyId },
      orderBy: { reportDate: 'desc' }
    });
  }
  
  async getAllReports() {
    return await prisma.report.findMany({
      include: { pharmacy: true },
      orderBy: { reportDate: 'desc' }
    });
  }
  
  async updateReport(id: string, data: Partial<ReportCreateRequest>) {
    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { id }
    });
    
    if (!existingReport) {
      throw new Error('Report not found');
    }
    
    // Update report
    const updatedReport = await prisma.report.update({
      where: { id },
      data
    });
    
    return updatedReport;
  }
  
  async deleteReport(id: string) {
    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { id }
    });
    
    if (!existingReport) {
      throw new Error('Report not found');
    }
    
    // Delete report
    await prisma.report.delete({
      where: { id }
    });
    
    return { message: 'Report deleted successfully' };
  }
  
  async getReportsByDateRange(startDate: Date, endDate: Date) {
    return await prisma.report.findMany({
      where: {
        reportDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: { pharmacy: true },
      orderBy: { reportDate: 'desc' }
    });
  }
  
  async getReportsByLGA(lga: string) {
    return await prisma.report.findMany({
      where: {
        pharmacy: {
          lga
        }
      },
      include: { pharmacy: true },
      orderBy: { reportDate: 'desc' }
    });
  }
  
  async getReportsByWard(ward: string) {
    return await prisma.report.findMany({
      where: {
        pharmacy: {
          ward
        }
      },
      include: { pharmacy: true },
      orderBy: { reportDate: 'desc' }
    });
  }
  
  async getReportsSummary() {
    const totalReports = await prisma.report.count();
    const totalPharmacies = await prisma.pharmacy.count();
    
    const totalPatientsServed = await prisma.report.aggregate({
      _sum: {
        patientsServed: true
      }
    });
    
    const totalReferrals = await prisma.report.aggregate({
      _sum: {
        referralsMade: true
      }
    });
    
    const totalAdverseReactions = await prisma.report.aggregate({
      _sum: {
        adverseDrugReactions: true
      }
    });
    
    return {
      totalReports,
      totalPharmacies,
      totalPatientsServed: totalPatientsServed._sum.patientsServed || 0,
      totalReferrals: totalReferrals._sum.referralsMade || 0,
      totalAdverseReactions: totalAdverseReactions._sum.adverseDrugReactions || 0
    };
  }
}
