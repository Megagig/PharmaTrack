import {
  NavLink,
  Stack,
  Button,
  Box,
  Text,
  Group,
  useMantineTheme,
  Badge,
  Avatar,
  Collapse,
  UnstyledButton,
} from '@mantine/core';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
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
  IconBell,
  IconChevronDown,
  IconShoppingCart,
  IconCash,
  IconTruckDelivery,
  IconUsers,
  IconReportMoney,
  IconChartBar,
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
  children?: NavItem[];
}

// Navigation items for pharmacy users

export function PharmacySidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const theme = useMantineTheme();
  const [openedMenu, setOpenedMenu] = useState<string | null>(null);

  // Get the pharmacy name from the user object
  const pharmacyName = user?.pharmacyId ? 'Your Pharmacy' : 'Your Pharmacy';
  const pharmacyInitial = pharmacyName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const toggleMenu = (menuName: string) => {
    setOpenedMenu(openedMenu === menuName ? null : menuName);
  };

  // Navigation items for pharmacy users
  const navItems: NavItem[] = [
    {
      path: '/pharmacy/dashboard',
      label: 'Dashboard',
      icon: <IconLayoutDashboard size={20} stroke={1.5} />,
    },
    {
      path: '/pharmacy/inventory',
      label: 'Inventory',
      icon: <IconPackage size={20} stroke={1.5} />,
      isNew: true,
      children: [
        {
          path: '/pharmacy/inventory/products',
          label: 'Products',
          icon: <IconPackage size={18} stroke={1.5} />,
        },
        {
          path: '/pharmacy/inventory/stock',
          label: 'Stock Management',
          icon: <IconChartBar size={18} stroke={1.5} />,
        },
        {
          path: '/pharmacy/inventory/purchases',
          label: 'Purchases',
          icon: <IconTruckDelivery size={18} stroke={1.5} />,
        },
        {
          path: '/pharmacy/inventory/sales',
          label: 'Sales',
          icon: <IconShoppingCart size={18} stroke={1.5} />,
        },
        {
          path: '/pharmacy/inventory/suppliers',
          label: 'Suppliers',
          icon: <IconUsers size={18} stroke={1.5} />,
        },
      ],
    },
    {
      path: '/pharmacy/finance',
      label: 'Finance',
      icon: <IconCash size={20} stroke={1.5} />,
      isNew: true,
      children: [
        {
          path: '/pharmacy/finance/transactions',
          label: 'Transactions',
          icon: <IconReportMoney size={18} stroke={1.5} />,
        },
        {
          path: '/pharmacy/finance/reports',
          label: 'Financial Reports',
          icon: <IconChartBar size={18} stroke={1.5} />,
        },
      ],
    },
    {
      path: '/pharmacy/submit-report',
      label: 'Submit Report',
      icon: <IconFileReport size={20} stroke={1.5} />,
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
          <Avatar color="teal" radius="xl" size="md">
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
            <Box key={item.path}>
              {item.children ? (
                <>
                  <UnstyledButton
                    onClick={() => toggleMenu(item.label)}
                    style={{
                      width: '100%',
                      borderRadius: theme.radius.md,
                      padding: '8px 12px',
                      backgroundColor:
                        openedMenu === item.label
                          ? theme.colors.teal[0]
                          : 'transparent',
                      '&:hover': {
                        backgroundColor: theme.colors.teal[0],
                      },
                    }}
                  >
                    <Group
                      justify="space-between"
                      wrap="nowrap"
                      style={{ width: '100%' }}
                    >
                      <Group gap="xs">
                        {item.icon}
                        <Text size="sm" fw={500}>
                          {item.label}
                        </Text>
                        {item.isNew && (
                          <Badge size="xs" variant="filled" color="indigo">
                            New
                          </Badge>
                        )}
                      </Group>

                      <Group gap="xs">
                        {item.badge && (
                          <Badge
                            size="sm"
                            variant="filled"
                            color={item.badge.color}
                            radius="xl"
                          >
                            {item.badge.text}
                          </Badge>
                        )}
                        <IconChevronDown
                          size={16}
                          style={{
                            transform:
                              openedMenu === item.label
                                ? 'rotate(180deg)'
                                : 'none',
                            transition: 'transform 200ms ease',
                          }}
                        />
                      </Group>
                    </Group>
                  </UnstyledButton>

                  <Collapse in={openedMenu === item.label}>
                    <Box pl="md" pr="xs">
                      <Stack gap="xs" mt="xs">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.path}
                            component={Link}
                            to={child.path}
                            label={
                              <Group gap="xs">
                                {child.icon}
                                <Text size="sm">{child.label}</Text>
                              </Group>
                            }
                            active={isActive(child.path)}
                            color="teal"
                            style={{
                              borderRadius: theme.radius.md,
                              marginBottom: 2,
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Collapse>
                </>
              ) : (
                <NavLink
                  component={Link}
                  to={item.path}
                  label={
                    <Group
                      justify="space-between"
                      wrap="nowrap"
                      style={{ width: '100%' }}
                    >
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
                          <Badge
                            size="sm"
                            variant="filled"
                            color={item.badge.color}
                            radius="xl"
                          >
                            {item.badge.text}
                          </Badge>
                        )}
                        <IconChevronRight
                          size={16}
                          style={{
                            opacity: isActive(item.path) ? 1 : 0.3,
                            transition: 'opacity 150ms ease',
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
              )}
            </Box>
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
