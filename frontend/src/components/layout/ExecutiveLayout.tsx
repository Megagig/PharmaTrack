import { ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { ExecutiveSidebar } from '../sidebar/ExecutiveSidebar';

interface ExecutiveLayoutProps {
  children: ReactNode;
}

export function ExecutiveLayout({ children }: ExecutiveLayoutProps) {
  return (
    <DashboardLayout
      sidebar={<ExecutiveSidebar />}
      title="PharmaTrack Executive"
    >
      {children}
    </DashboardLayout>
  );
}
