import { NavLink, Stack, Title, Divider, Button } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function PharmacySidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Stack h="100%" justify="space-between">
      <Stack gap="xs">
        <Title order={4} ta="center" py="md">
          PharmaTrack Pharmacy
        </Title>
        <Divider />

        <NavLink
          component={Link}
          to="/pharmacy/dashboard"
          label="Dashboard"
          variant="filled"
        />

        <NavLink
          component={Link}
          to="/pharmacy/submit-report"
          label="Submit Monthly Report"
          variant="filled"
        />

        <NavLink
          component={Link}
          to="/pharmacy/my-reports"
          label="My Previous Reports"
          variant="filled"
        />

        <NavLink
          component={Link}
          to="/pharmacy/stock"
          label="Stock Management"
          variant="filled"
        />

        <NavLink
          component={Link}
          to="/pharmacy/profile"
          label="Profile"
          variant="filled"
        />

        <NavLink
          component={Link}
          to="/pharmacy/audit-logs"
          label="Audit Logs"
          variant="filled"
        />

        <NavLink
          component={Link}
          to="/pharmacy/support"
          label="Help / Support"
          variant="filled"
        />
      </Stack>

      <Button color="red" onClick={handleLogout} mb="md">
        Logout
      </Button>
    </Stack>
  );
}
