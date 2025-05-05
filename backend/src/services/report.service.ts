import { prisma } from '../server';
import { ReportCreateRequest } from '../types';
import * as XLSX from 'xlsx';

export class ReportService {
  async createReport(pharmacyId: string, data: ReportCreateRequest) {
    // Check if pharmacy exists
    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id: pharmacyId },
    });

    if (!pharmacy) {
      throw new Error('Pharmacy not found');
    }

    // Create new report
    const report = await prisma.report.create({
      data: {
        ...data,
        pharmacyId,
      },
    });

    return report;
  }

  async getReportById(id: string) {
    const report = await prisma.report.findUnique({
      where: { id },
      include: { pharmacy: true },
    });

    if (!report) {
      throw new Error('Report not found');
    }

    return report;
  }

  async getReportsByPharmacy(pharmacyId: string) {
    return await prisma.report.findMany({
      where: { pharmacyId },
      orderBy: { reportDate: 'desc' },
    });
  }

  async getAllReports() {
    return await prisma.report.findMany({
      include: { pharmacy: true },
      orderBy: { reportDate: 'desc' },
    });
  }

  async updateReport(id: string, data: Partial<ReportCreateRequest>) {
    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { id },
    });

    if (!existingReport) {
      throw new Error('Report not found');
    }

    // Update report
    const updatedReport = await prisma.report.update({
      where: { id },
      data,
    });

    return updatedReport;
  }

  async deleteReport(id: string) {
    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { id },
    });

    if (!existingReport) {
      throw new Error('Report not found');
    }

    // Delete report
    await prisma.report.delete({
      where: { id },
    });

    return { message: 'Report deleted successfully' };
  }

  async getReportsByDateRange(startDate: Date, endDate: Date) {
    return await prisma.report.findMany({
      where: {
        reportDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { pharmacy: true },
      orderBy: { reportDate: 'desc' },
    });
  }

  async getReportsByLGA(lga: string) {
    return await prisma.report.findMany({
      where: {
        pharmacy: {
          lga,
        },
      },
      include: { pharmacy: true },
      orderBy: { reportDate: 'desc' },
    });
  }

  async getReportsByWard(ward: string) {
    return await prisma.report.findMany({
      where: {
        pharmacy: {
          ward,
        },
      },
      include: { pharmacy: true },
      orderBy: { reportDate: 'desc' },
    });
  }

  async getReportsSummary() {
    const totalReports = await prisma.report.count();
    const totalPharmacies = await prisma.pharmacy.count();

    const totalPatientsServed = await prisma.report.aggregate({
      _sum: {
        patientsServed: true,
      },
    });

    const totalReferrals = await prisma.report.aggregate({
      _sum: {
        referralsMade: true,
      },
    });

    const totalAdverseReactions = await prisma.report.aggregate({
      _sum: {
        adverseDrugReactions: true,
      },
    });

    return {
      totalReports,
      totalPharmacies,
      totalPatientsServed: totalPatientsServed._sum.patientsServed || 0,
      totalReferrals: totalReferrals._sum.referralsMade || 0,
      totalAdverseReactions:
        totalAdverseReactions._sum.adverseDrugReactions || 0,
    };
  }

  async exportToExcel(
    startDate: Date,
    endDate: Date,
    format: 'detailed' | 'summary' = 'detailed'
  ) {
    try {
      // Get all reports within date range with pharmacy information
      const reports = await prisma.report.findMany({
        where: {
          reportDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          pharmacy: true,
        },
        orderBy: {
          reportDate: 'desc',
        },
      });

      let worksheetData: any[];

      if (format === 'detailed') {
        // Detailed export with all information
        worksheetData = reports.map((report) => ({
          'Report Date': new Date(report.reportDate).toLocaleDateString(),
          'Pharmacy Name': report.pharmacy?.name || 'N/A',
          LGA: report.pharmacy?.lga || 'N/A',
          Ward: report.pharmacy?.ward || 'N/A',
          'Total Patients': report.patientsServed,
          'Male Patients': report.maleCount || 0,
          'Female Patients': report.femaleCount || 0,
          'Children (0-12)': report.childrenCount || 0,
          'Adults (13-59)': report.adultCount || 0,
          'Elderly (60+)': report.elderlyCount || 0,
          'Top Medications': report.topMedications.join(', '),
          'Common Ailments': report.commonAilments.join(', '),
          'Adverse Reactions': report.adverseDrugReactions,
          'Referrals Made': report.referralsMade,
          Immunizations: report.immunizationsGiven || 0,
          'Health Education Sessions': report.healthEducationSessions || 0,
          'BP Checks': report.bpChecks || 0,
          'Supply Issues':
            [
              report.expiredDrugs ? 'Expired Drugs' : '',
              report.stockouts ? 'Stockouts' : '',
              report.supplyDelays ? 'Supply Delays' : '',
            ]
              .filter(Boolean)
              .join(', ') || 'None',
          Notes: report.notes || '',
        }));
      } else {
        // Summary export with aggregated data by LGA
        const lgaData = new Map();

        reports.forEach((report) => {
          const lga = report.pharmacy?.lga || 'Unknown';
          if (!lgaData.has(lga)) {
            lgaData.set(lga, {
              LGA: lga,
              'Total Reports': 0,
              'Total Patients': 0,
              'Total Referrals': 0,
              'Total Adverse Reactions': 0,
              'Total Immunizations': 0,
              'Total Health Sessions': 0,
              'Total BP Checks': 0,
              Pharmacies: new Set(),
            });
          }

          const data = lgaData.get(lga);
          data['Total Reports']++;
          data['Total Patients'] += report.patientsServed;
          data['Total Referrals'] += report.referralsMade;
          data['Total Adverse Reactions'] += report.adverseDrugReactions;
          data['Total Immunizations'] += report.immunizationsGiven || 0;
          data['Total Health Sessions'] += report.healthEducationSessions || 0;
          data['Total BP Checks'] += report.bpChecks || 0;
          data['Pharmacies'].add(report.pharmacy?.name);
        });

        worksheetData = Array.from(lgaData.values()).map((data) => ({
          ...data,
          'Number of Pharmacies': data['Pharmacies'].size,
          Pharmacies: Array.from(data['Pharmacies']).join(', '),
        }));
      }

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

      // Generate buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return buffer;
    } catch (error) {
      throw new Error('Failed to generate Excel export');
    }
  }
}
