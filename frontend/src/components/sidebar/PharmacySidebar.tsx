import { NavLink, Stack, Button, Box, Text, Group, useMantineTheme, Badge, Avatar, useMantineColorScheme } from '@mantine/core';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  IconLayoutDashboard, 
  IconFileReport, 
  IconHistory, 
  IconPackage, 
  IconUser, 
  IconList, 
  IconHelp, 
  IconLogout,
  IconChevronRight,
  IconReportAnalytics,
  IconSettings,
  IconBell
} from '@tabler/icons-react';

// Define sidebar navigation items
interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    color: string;
  };
  isNew?: boolean;
}

// Navigation items for pharmacy users

export function PharmacySidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const theme = useMantineTheme();
  
  // Get the pharmacy name from the user object
  const pharmacyName = user?.pharmacyId ? 'Your Pharmacy' : 'Your Pharmacy';
  const pharmacyInitial = pharmacyName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Navigation items for pharmacy users
  const navItems: NavItem[] = [
    {
      path: '/pharmacy/dashboard',
      label: 'Dashboard',
      icon: <IconLayoutDashboard size={20} stroke={1.5} />,
    },
    {
      path: '/pharmacy/submit-report',
      label: 'Submit Report',
      icon: <IconFileReport size={20} stroke={1.5} />,
      isNew: true,
    },
    {
      path: '/pharmacy/my-reports',
      label: 'My Reports',
      icon: <IconHistory size={20} stroke={1.5} />,
      badge: {
        text: '3',
        color: 'teal',
      },
    },
    {
      path: '/pharmacy/stock',
      label: 'Inventory',
      icon: <IconPackage size={20} stroke={1.5} />,
    },
    {
      path: '/pharmacy/analytics',
      label: 'Analytics',
      icon: <IconReportAnalytics size={20} stroke={1.5} />,
    },
    {
      path: '/pharmacy/profile',
      label: 'Profile',
      icon: <IconUser size={20} stroke={1.5} />,
    },
    {
      path: '/pharmacy/audit-logs',
      label: 'Audit Logs',
      icon: <IconList size={20} stroke={1.5} />,
    },
    {
      path: '/pharmacy/notifications',
      label: 'Notifications',
      icon: <IconBell size={20} stroke={1.5} />,
      badge: {
        text: '5',
        color: 'red',
      },
    },
    {
      path: '/pharmacy/settings',
      label: 'Settings',
      icon: <IconSettings size={20} stroke={1.5} />,
    },
    {
      path: '/pharmacy/support',
      label: 'Help & Support',
      icon: <IconHelp size={20} stroke={1.5} />,
    },
  ];

  return (
    <Stack h="100%" justify="space-between" gap={0}>
      {/* Pharmacy Profile Section */}
      <Box mb="xl">
        <Group mb="md" p="md">
          <Avatar 
            color="teal" 
            radius="xl" 
            size="md"
          >
            {pharmacyInitial}
          </Avatar>
          <Box style={{ flex: 1 }}>
            <Text fw={600} size="sm" lineClamp={1}>
              {pharmacyName}
            </Text>
            <Text size="xs" c="dimmed">
              {user?.email || 'pharmacy@example.com'}
            </Text>
          </Box>
        </Group>
      </Box>

      {/* Navigation Links */}
      <Box style={{ flex: 1, overflowY: 'auto' }} px="xs">
        <Stack gap="xs">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              component={Link}
              to={item.path}
              label={
                <Group justify="space-between" wrap="nowrap" style={{ width: '100%' }}>
                  <Group gap="xs">
                    {item.icon}
                    <Text size="sm">{item.label}</Text>
                    {item.isNew && (
                      <Badge size="xs" variant="filled" color="indigo">
                        New
                      </Badge>
                    )}
                  </Group>
                  
                  <Group gap="xs">
                    {item.badge && (
                      <Badge size="sm" variant="filled" color={item.badge.color} radius="xl">
                        {item.badge.text}
                      </Badge>
                    )}
                    <IconChevronRight 
                      size={16} 
                      style={{ 
                        opacity: isActive(item.path) ? 1 : 0.3,
                        transition: 'opacity 150ms ease'
                      }} 
                    />
                  </Group>
                </Group>
              }
              active={isActive(item.path)}
              color="teal"
              style={{
                borderRadius: theme.radius.md,
                marginBottom: 4,
              }}
            />
          ))}
        </Stack>
      </Box>
      
      {/* Logout Button */}
      <Box p="md" pt="xl">
        <Button 
          color="red" 
          onClick={handleLogout}
          leftSection={<IconLogout size={18} />}
          variant="light"
          fullWidth
          radius="md"
        >
          Logout
        </Button>
      </Box>
    </Stack>
  );
}
