import { Navigate, RouteObject } from 'react-router-dom';
import { ExecutiveLayout } from '../components/layout/ExecutiveLayout';
import { Dashboard } from '../pages/executive/Dashboard';
import { AllPharmacies } from '../pages/executive/AllPharmacies';
import { ReportsOverview } from '../pages/executive/ReportsOverview';
import { MonthlyReports } from '../pages/executive/MonthlyReports';
import { ComplianceMonitoring } from '../pages/executive/ComplianceMonitoring';
import { MedicationsTrends } from '../pages/executive/MedicationsTrends';
import { PublicHealthActivities } from '../pages/executive/PublicHealthActivities';
import { UserManagement } from '../pages/executive/UserManagement';
import { Settings } from '../pages/executive/Settings';
import { AuditLogs } from '../pages/common/AuditLogs';
import { useAuthStore } from '../store/authStore';

const ExecutiveRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'EXECUTIVE' && user?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export const executiveRoutes: RouteObject[] = [
  {
    path: '/executive',
    element: (
      <ExecutiveRoute>
        <ExecutiveLayout>
          <Navigate to="/executive/dashboard" />
        </ExecutiveLayout>
      </ExecutiveRoute>
    ),
  },
  {
    path: '/executive/dashboard',
    element: (
      <ExecutiveRoute>
        <ExecutiveLayout>
          <Dashboard />
        </ExecutiveLayout>
      </ExecutiveRoute>
    ),
  },
  {
    path: '/executive/pharmacies',
    element: (
      <ExecutiveRoute>
        <ExecutiveLayout>
          <AllPharmacies />
        </ExecutiveLayout>
      </ExecutiveRoute>
    ),
  },
  {
    path: '/executive/reports-overview',
    element: (
      <ExecutiveRoute>
        <ExecutiveLayout>
          <ReportsOverview />
        </ExecutiveLayout>
      </ExecutiveRoute>
    ),
  },
  {
    path: '/executive/monthly-reports',
    element: (
      <ExecutiveRoute>
        <ExecutiveLayout>
          <MonthlyReports />
        </ExecutiveLayout>
      </ExecutiveRoute>
    ),
  },
  {
    path: '/executive/compliance',
    element: (
      <ExecutiveRoute>
        <ExecutiveLayout>
          <ComplianceMonitoring />
        </ExecutiveLayout>
      </ExecutiveRoute>
    ),
  },
  {
    path: '/executive/medications-trends',
    element: (
      <ExecutiveRoute>
        <ExecutiveLayout>
          <MedicationsTrends />
        </ExecutiveLayout>
      </ExecutiveRoute>
    ),
  },
  {
    path: '/executive/public-health',
    element: (
      <ExecutiveRoute>
        <ExecutiveLayout>
          <PublicHealthActivities />
        </ExecutiveLayout>
      </ExecutiveRoute>
    ),
  },
  {
    path: '/executive/user-management',
    element: (
      <ExecutiveRoute>
        <ExecutiveLayout>
          <UserManagement />
        </ExecutiveLayout>
      </ExecutiveRoute>
    ),
  },
  {
    path: '/executive/settings',
    element: (
      <ExecutiveRoute>
        <ExecutiveLayout>
          <Settings />
        </ExecutiveLayout>
      </ExecutiveRoute>
    ),
  },
  {
    path: '/executive/audit-logs',
    element: (
      <ExecutiveRoute>
        <ExecutiveLayout>
          <AuditLogs />
        </ExecutiveLayout>
      </ExecutiveRoute>
    ),
  },
];
