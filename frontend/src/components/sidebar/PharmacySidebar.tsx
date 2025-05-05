import { NavLink, Stack, Title, Divider, Button, Box, Text, Group, useMantineTheme } from '@mantine/core';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// Icons for sidebar items
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9"></rect>
    <rect x="14" y="3" width="7" height="5"></rect>
    <rect x="14" y="12" width="7" height="9"></rect>
    <rect x="3" y="16" width="7" height="5"></rect>
  </svg>
);

const ReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
    <path d="M3 3v5h5"></path>
    <path d="M12 7v5l4 2"></path>
  </svg>
);

const StockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6v14H4V6l8-4 8 4Z"></path>
    <path d="M4 6h16"></path>
    <path d="M12 10v8"></path>
    <path d="M8 10v8"></path>
    <path d="M16 10v8"></path>
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const AuditLogsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12"></path>
    <path d="M6 7h12"></path>
    <path d="M17 17H5a2 2 0 0 0-2 2v2h16v-2a2 2 0 0 0-2-2Z"></path>
  </svg>
);

const SupportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

export function PharmacySidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const theme = useMantineTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Stack h="100%" justify="space-between">
      <Stack gap="md">
        <Box mb="md">
          <Title order={4} ta="center" py="md" c={theme.colors.blue[7]}>
            Pharmacy Dashboard
          </Title>
          <Divider />
        </Box>
        
        <NavLink
          component={Link}
          to="/pharmacy/dashboard"
          label={
            <Group>
              <DashboardIcon />
              <Text>Dashboard</Text>
            </Group>
          }
          active={isActive('/pharmacy/dashboard')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/pharmacy/submit-report"
          label={
            <Group>
              <ReportIcon />
              <Text>Submit Monthly Report</Text>
            </Group>
          }
          active={isActive('/pharmacy/submit-report')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/pharmacy/my-reports"
          label={
            <Group>
              <HistoryIcon />
              <Text>My Previous Reports</Text>
            </Group>
          }
          active={isActive('/pharmacy/my-reports')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/pharmacy/stock"
          label={
            <Group>
              <StockIcon />
              <Text>Stock Management</Text>
            </Group>
          }
          active={isActive('/pharmacy/stock')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/pharmacy/profile"
          label={
            <Group>
              <ProfileIcon />
              <Text>Profile</Text>
            </Group>
          }
          active={isActive('/pharmacy/profile')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/pharmacy/audit-logs"
          label={
            <Group>
              <AuditLogsIcon />
              <Text>Audit Logs</Text>
            </Group>
          }
          active={isActive('/pharmacy/audit-logs')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/pharmacy/support"
          label={
            <Group>
              <SupportIcon />
              <Text>Help / Support</Text>
            </Group>
          }
          active={isActive('/pharmacy/support')}
          variant="light"
        />
      </Stack>
      
      <Button 
        color="red" 
        onClick={handleLogout}
        mb="md"
        leftSection={<LogoutIcon />}
        variant="outline"
        fullWidth
      >
        Logout
      </Button>
    </Stack>
  );
}
