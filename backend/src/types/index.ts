import { Request } from 'express';

export enum UserRole {
  PHARMACY = 'PHARMACY',
  EXECUTIVE = 'EXECUTIVE',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  pharmacyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface Report {
  id: string;
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

  pharmacyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  pharmacyId?: string;
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

export interface PharmacyRegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  pharmacy: PharmacyCreateRequest;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface ReportSummary {
  totalReports: number;
  totalPharmacies: number;
  totalPatientsServed: number;
  totalReferrals: number;
  totalAdverseReactions: number;
}

export interface PromoteUserRequest {
  userId: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  pharmacyId?: string;
}
