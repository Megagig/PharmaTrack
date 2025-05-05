import { NavLink, Stack, Title, Divider, Button } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function ExecutiveSidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Stack h="100%" justify="space-between">
      <Stack gap="xs">
        <Title order={4} ta="center" py="md">PharmaTrack Executive</Title>
        <Divider />
        
        <NavLink
          component={Link}
          to="/executive/dashboard"
          label="Dashboard"
          variant="filled"
        />
        
        <NavLink
          component={Link}
          to="/executive/pharmacies"
          label="View All Pharmacies"
          variant="filled"
        />
        
        <NavLink
          component={Link}
          to="/executive/reports-overview"
          label="Reports Overview"
          variant="filled"
        />
        
        <NavLink
          component={Link}
          to="/executive/monthly-reports"
          label="View Monthly Reports"
          variant="filled"
        />
        
        <NavLink
          component={Link}
          to="/executive/compliance"
          label="Compliance Monitoring"
          variant="filled"
        />
        
        <NavLink
          component={Link}
          to="/executive/medications-trends"
          label="Medications/Ailments Trends"
          variant="filled"
        />
        
        <NavLink
          component={Link}
          to="/executive/public-health"
          label="Public Health Activities"
          variant="filled"
        />
        
        <NavLink
          component={Link}
          to="/executive/user-management"
          label="User Management"
          variant="filled"
        />
        
        <NavLink
          component={Link}
          to="/executive/settings"
          label="Settings"
          variant="filled"
        />
      </Stack>
      
      <Button 
        color="red" 
        onClick={handleLogout}
        mb="md"
      >
        Logout
      </Button>
    </Stack>
  );
}
