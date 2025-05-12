import { ReactNode, useState, useEffect } from 'react';
import {
  AppShell,
  Group,
  Box,
  Burger,
  Text,
  useMantineTheme,
  rem,
  Title,
  Flex,
  Image,
  ActionIcon,
  Tooltip,
  Avatar,
  Menu,
  Divider,
  useMantineColorScheme,
  Button,
  Badge,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { NotificationsPanel } from '../common/NotificationsPanel';
import { PageTransition } from '../animations/PageTransition';
import { useAuthStore } from '../../store/authStore';
import { IconSun, IconMoon, IconUser, IconLogout, IconSettings, IconChevronRight } from '@tabler/icons-react';

interface DashboardLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  title?: string;
}

export function DashboardLayout({
  sidebar,
  children,
  title = 'PharmaTrack',
}: DashboardLayoutProps) {
  const [mobileOpened, setMobileOpened] = useState(false);
  const [desktopOpened, setDesktopOpened] = useState(true);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { user, logout } = useAuthStore();

  const toggleMobile = () => setMobileOpened((o) => !o);
  const toggleDesktop = () => setDesktopOpened((o) => !o);
  const toggleColorScheme = () => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  
  // Close mobile navbar when navigating on mobile
  useEffect(() => {
    if (isMobile && mobileOpened) {
      setMobileOpened(false);
    }
  }, [children]);

  return (
    <AppShell
      header={{ height: { base: 70, md: 80 } }}
      navbar={{
        width: { base: 280, md: 300, lg: 320 },
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding={{ base: 'md', md: 'lg' }}
      transitionDuration={300}
      transitionTimingFunction="ease"
    >
      <AppShell.Header
        px="md"
        withBorder
        style={{
          background: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          color: colorScheme === 'dark' ? theme.white : theme.black,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Flex h="100%" align="center" justify="space-between">
          <Group>
            <Burger
              opened={isMobile ? mobileOpened : desktopOpened}
              onClick={isMobile ? toggleMobile : toggleDesktop}
              size="sm"
              color={colorScheme === 'dark' ? theme.white : theme.black}
              aria-label="Toggle navigation"
            />
            <Flex align="center" gap="xs">
              <Box
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: theme.radius.md,
                  background: `linear-gradient(135deg, ${theme.colors.teal[6]} 0%, ${theme.colors.indigo[7]} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 20,
                }}
              >
                P
              </Box>
              <Title order={3} c={colorScheme === 'dark' ? 'white' : 'dark'}>
                {title}
              </Title>
              {user?.role && (
                <Badge
                  color={user.role === 'ADMIN' ? 'red' : user.role === 'EXECUTIVE' ? 'indigo' : 'teal'}
                  variant="filled"
                  radius="sm"
                  ml={5}
                  style={{ textTransform: 'capitalize' }}
                >
                  {user.role.toLowerCase()}
                </Badge>
              )}
            </Flex>
          </Group>

          <Group>
            <Tooltip label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'} withArrow position="bottom">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={toggleColorScheme}
                aria-label="Toggle color scheme"
              >
                {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>
            </Tooltip>
            
            <NotificationsPanel />
            
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <Flex
                  style={{ cursor: 'pointer' }}
                  align="center"
                  gap="xs"
                >
                  <Avatar 
                    color="teal" 
                    radius="xl"
                    src={null}
                  >
                    {user?.email?.substring(0, 2).toUpperCase() || 'U'}
                  </Avatar>
                  {!isMobile && (
                    <Box>
                      <Text size="sm" fw={500} lh={1.2}>
                        {user?.email?.split('@')[0] || 'User'}
                      </Text>
                      <Text size="xs" c="dimmed" lh={1.2}>
                        {user?.role?.toLowerCase() || 'user'}
                      </Text>
                    </Box>
                  )}
                </Flex>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item leftSection={<IconUser size={14} />}>
                  Profile
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                  Settings
                </Menu.Item>
                <Divider />
                <Menu.Item 
                  leftSection={<IconLogout size={14} />} 
                  color="red"
                  onClick={logout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        withBorder
        style={{
          boxShadow: colorScheme === 'dark' ? 'none' : '0 0 15px rgba(0, 0, 0, 0.05)',
          transition: 'all 300ms ease',
          background: colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        }}
      >
        <Box mb="xl">
          <Text size="xs" fw={500} c="dimmed" tt="uppercase" mb="xs">
            Navigation
          </Text>
          <Divider mb="md" />
        </Box>
        {sidebar}
        
        <Box mt="auto" pt="xl">
          <Divider mb="md" />
          <Button 
            fullWidth 
            leftSection={<IconLogout size={16} />}
            variant="light" 
            color="red"
            onClick={logout}
          >
            Logout
          </Button>
        </Box>
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          backgroundColor:
            colorScheme === 'dark'
              ? theme.colors.dark[9]
              : theme.colors.gray[0],
          transition: 'padding 300ms ease',
        }}
      >
        <Box
          p={{ base: 'md', md: 'xl' }}
          style={{
            borderRadius: theme.radius.lg,
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            minHeight: `calc(100vh - ${rem(160)})`,
            boxShadow: colorScheme === 'dark' ? 'none' : '0 0 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <PageTransition>{children}</PageTransition>
        </Box>
        
        <Box mt="xl" mb="md" ta="center">
          <Text size="xs" c="dimmed">
            © {new Date().getFullYear()} PharmaTrack. All rights reserved.
          </Text>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
