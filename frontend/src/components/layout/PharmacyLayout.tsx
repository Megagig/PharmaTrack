import { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { PharmacySidebar } from '../sidebar/PharmacySidebar';

interface PharmacyLayoutProps {
  children: ReactNode;
}

export function PharmacyLayout({ children }: PharmacyLayoutProps) {
  return (
    <DashboardLayout sidebar={<PharmacySidebar />}>
      {children}
    </DashboardLayout>
  );
}
