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

const PharmaciesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 10h2l-4-8H7L3 10h2"></path>
    <path d="M12 16v4"></path>
    <path d="M8 16v4"></path>
    <path d="M16 16v4"></path>
    <path d="M3 10v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V10"></path>
  </svg>
);

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const ComplianceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const MedicationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
  </svg>
);

const PublicHealthIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const UserManagementIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const AuditLogsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12"></path>
    <path d="M6 7h12"></path>
    <path d="M17 17H5a2 2 0 0 0-2 2v2h16v-2a2 2 0 0 0-2-2Z"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

export function ExecutiveSidebar() {
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
            Executive Dashboard
          </Title>
          <Divider />
        </Box>
        
        <NavLink
          component={Link}
          to="/executive/dashboard"
          label={
            <Group>
              <DashboardIcon />
              <Text>Dashboard</Text>
            </Group>
          }
          active={isActive('/executive/dashboard')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/executive/pharmacies"
          label={
            <Group>
              <PharmaciesIcon />
              <Text>View All Pharmacies</Text>
            </Group>
          }
          active={isActive('/executive/pharmacies')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/executive/reports-overview"
          label={
            <Group>
              <ReportsIcon />
              <Text>Reports Overview</Text>
            </Group>
          }
          active={isActive('/executive/reports-overview')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/executive/monthly-reports"
          label={
            <Group>
              <ReportsIcon />
              <Text>View Monthly Reports</Text>
            </Group>
          }
          active={isActive('/executive/monthly-reports')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/executive/compliance"
          label={
            <Group>
              <ComplianceIcon />
              <Text>Compliance Monitoring</Text>
            </Group>
          }
          active={isActive('/executive/compliance')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/executive/medications-trends"
          label={
            <Group>
              <MedicationsIcon />
              <Text>Medications/Ailments</Text>
            </Group>
          }
          active={isActive('/executive/medications-trends')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/executive/public-health"
          label={
            <Group>
              <PublicHealthIcon />
              <Text>Public Health Activities</Text>
            </Group>
          }
          active={isActive('/executive/public-health')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/executive/user-management"
          label={
            <Group>
              <UserManagementIcon />
              <Text>User Management</Text>
            </Group>
          }
          active={isActive('/executive/user-management')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/executive/audit-logs"
          label={
            <Group>
              <AuditLogsIcon />
              <Text>Audit Logs</Text>
            </Group>
          }
          active={isActive('/executive/audit-logs')}
          variant="light"
        />
        
        <NavLink
          component={Link}
          to="/executive/settings"
          label={
            <Group>
              <SettingsIcon />
              <Text>Settings</Text>
            </Group>
          }
          active={isActive('/executive/settings')}
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
