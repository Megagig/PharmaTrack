import { Navigate, RouteObject } from 'react-router-dom';
import { PharmacyLayout } from '../components/layout/PharmacyLayout';
import { Dashboard } from '../pages/pharmacy/Dashboard';
import { SubmitReport } from '../pages/pharmacy/SubmitReport';
import { MyReports } from '../pages/pharmacy/MyReports';
import { StockManagement } from '../pages/pharmacy/StockManagement';
import { Profile } from '../pages/pharmacy/Profile';
import { Support } from '../pages/pharmacy/Support';
import { AuditLogs } from '../pages/common/AuditLogs';
import { useAuthStore } from '../store/authStore';

const PharmacyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'PHARMACY') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export const pharmacyRoutes: RouteObject[] = [
  {
    path: '/pharmacy',
    element: (
      <PharmacyRoute>
        <PharmacyLayout>
          <Navigate to="/pharmacy/dashboard" />
        </PharmacyLayout>
      </PharmacyRoute>
    ),
  },
  {
    path: '/pharmacy/dashboard',
    element: (
      <PharmacyRoute>
        <PharmacyLayout>
          <Dashboard />
        </PharmacyLayout>
      </PharmacyRoute>
    ),
  },
  {
    path: '/pharmacy/submit-report',
    element: (
      <PharmacyRoute>
        <PharmacyLayout>
          <SubmitReport />
        </PharmacyLayout>
      </PharmacyRoute>
    ),
  },
  {
    path: '/pharmacy/my-reports',
    element: (
      <PharmacyRoute>
        <PharmacyLayout>
          <MyReports />
        </PharmacyLayout>
      </PharmacyRoute>
    ),
  },
  {
    path: '/pharmacy/stock',
    element: (
      <PharmacyRoute>
        <PharmacyLayout>
          <StockManagement />
        </PharmacyLayout>
      </PharmacyRoute>
    ),
  },
  {
    path: '/pharmacy/profile',
    element: (
      <PharmacyRoute>
        <PharmacyLayout>
          <Profile />
        </PharmacyLayout>
      </PharmacyRoute>
    ),
  },
  {
    path: '/pharmacy/support',
    element: (
      <PharmacyRoute>
        <PharmacyLayout>
          <Support />
        </PharmacyLayout>
      </PharmacyRoute>
    ),
  },
  {
    path: '/pharmacy/audit-logs',
    element: (
      <PharmacyRoute>
        <PharmacyLayout>
          <AuditLogs />
        </PharmacyLayout>
      </PharmacyRoute>
    ),
  },
];
