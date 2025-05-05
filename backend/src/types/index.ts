export enum UserRole {
  PHARMACY = 'PHARMACY',
  EXECUTIVE = 'EXECUTIVE',
  ADMIN = 'ADMIN'
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
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  pharmacyId?: string;
}
