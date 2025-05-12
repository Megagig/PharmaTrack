import api from './api';

export interface Report {
  id: string;
  pharmacyId: string;
  reportDate: Date;
  patientsServed: number;
  maleCount?: number;
  femaleCount?: number;
  childrenCount?: number;
  adultCount?: number;
  elderlyCount?: number;
  topMedications: string[];
  commonAilments: string[];
  adverseDrugReactions: number;
  adverseReactionDetails?: string;
  referralsMade: number;
  immunizationsGiven?: number;
  healthEducationSessions?: number;
  bpChecks?: number;
  expiredDrugs?: boolean;
  stockouts?: boolean;
  supplyDelays?: boolean;
  notes?: string;

  // Service Delivery Data
  prescriptionsFilled?: number;
  otcConsultations?: number;
  mtmInterventions?: number;

  // Economic Contribution
  monthlyRevenue?: number;
  staffPharmacists?: number;
  staffTechnicians?: number;
  staffOthers?: number;
  taxesPaid?: number;
  localSuppliersCount?: number;

  // Challenges and Barriers
  regulatoryComplianceCost?: number;
  hasSubsidizedMedicines?: boolean;
  insuranceInclusionIssues?: boolean;
  fakeOrSubstandardDrugs?: number;
  rejectedInsuranceClaims?: number;

  // Public Health Role
  publicHealthPartnerships?: string[];

  // Technology and Digital Adoption
  usesElectronicRecords?: boolean;
  usesMobileHealth?: boolean;
  usesInventoryManagement?: boolean;

  // Community Feedback
  patientSatisfactionScore?: number;
  timeComparedToHospital?: number;

  pharmacy?: {
    id: string;
    name: string;
    ward: string;
    lga: string;
    address: string;
    phoneNumber: string;
    email?: string;
    pharmacistInCharge: string;
  };
}

export interface ReportCreateRequest {
  reportDate: Date;
  patientsServed: number;
  maleCount?: number;
  femaleCount?: number;
  childrenCount?: number;
  adultCount?: number;
  elderlyCount?: number;
  topMedications: string[];
  commonAilments: string[];
  adverseDrugReactions: number;
  adverseReactionDetails?: string;
  referralsMade: number;
  immunizationsGiven?: number;
  healthEducationSessions?: number;
  bpChecks?: number;
  expiredDrugs?: boolean;
  stockouts?: boolean;
  supplyDelays?: boolean;
  notes?: string;

  // Service Delivery Data
  prescriptionsFilled?: number;
  otcConsultations?: number;
  mtmInterventions?: number;

  // Economic Contribution
  monthlyRevenue?: number;
  staffPharmacists?: number;
  staffTechnicians?: number;
  staffOthers?: number;
  taxesPaid?: number;
  localSuppliersCount?: number;

  // Challenges and Barriers
  regulatoryComplianceCost?: number;
  hasSubsidizedMedicines?: boolean;
  insuranceInclusionIssues?: boolean;
  fakeOrSubstandardDrugs?: number;
  rejectedInsuranceClaims?: number;

  // Public Health Role
  publicHealthPartnerships?: string[];

  // Technology and Digital Adoption
  usesElectronicRecords?: boolean;
  usesMobileHealth?: boolean;
  usesInventoryManagement?: boolean;

  // Community Feedback
  patientSatisfactionScore?: number;
  timeComparedToHospital?: number;
}

export interface ReportSummary {
  totalReports: number;
  totalPharmacies: number;
  totalPatientsServed: number;
  totalReferrals: number;
  totalAdverseReactions: number;
}

export const reportService = {
  // Create new report
  createReport: async (data: ReportCreateRequest): Promise<Report> => {
    try {
      const response = await api.post<Report>('/reports', data);
      return response.data;
    } catch (error) {
      console.error('Error in createReport service:', error);
      // Store the report data in localStorage as a backup
      try {
        localStorage.setItem('pendingReport', JSON.stringify(data));
        console.log('Report data saved to localStorage as backup from service');
      } catch (storageError) {
        console.error('Failed to save report to localStorage:', storageError);
      }
      throw error; // Re-throw to be handled by the component
    }
  },

  // Get report by ID
  getReportById: async (id: string): Promise<Report> => {
    try {
      const response = await api.get<Report>(`/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching report with ID ${id}:`, error);
      throw error;
    }
  },

  // Get all reports (admin/executive only)
  getAllReports: async (): Promise<Report[]> => {
    try {
      const response = await api.get<Report[]>('/reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching all reports:', error);
      return []; // Return empty array instead of throwing
    }
  },

  // Update report
  updateReport: async (
    id: string,
    data: Partial<ReportCreateRequest>
  ): Promise<Report> => {
    const response = await api.put<Report>(`/reports/${id}`, data);
    return response.data;
  },

  // Delete report (admin/executive only)
  deleteReport: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/reports/${id}`);
    return response.data;
  },

  // Get reports by pharmacy ID
  getReportsByPharmacy: async (pharmacyId: string): Promise<Report[]> => {
    try {
      const response = await api.get<Report[]>(
        `/reports/pharmacy/${pharmacyId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching reports for pharmacy ${pharmacyId}:`,
        error
      );
      return []; // Return empty array instead of throwing
    }
  },

  // Get reports by date range
  getReportsByDateRange: async (
    startDate: Date,
    endDate: Date
  ): Promise<Report[]> => {
    const response = await api.get<Report[]>('/reports/date-range', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return response.data;
  },

  // Get reports summary (for dashboard)
  getReportsSummary: async (): Promise<ReportSummary> => {
    const response = await api.get<ReportSummary>('/reports/summary');
    return response.data;
  },

  // Get reports by LGA
  getReportsByLGA: async (lga: string): Promise<Report[]> => {
    const response = await api.get<Report[]>(`/reports/lga/${lga}`);
    return response.data;
  },

  // Export reports to Excel
  exportReports: async (
    startDate: Date,
    endDate: Date,
    format: 'detailed' | 'summary' = 'detailed'
  ): Promise<Blob> => {
    const response = await api.get('/reports/export', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        format,
      },
      responseType: 'blob',
    });
    return response.data;
  },
};
