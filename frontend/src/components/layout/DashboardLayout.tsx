import { ReactNode, useState } from 'react';
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
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { NotificationsPanel } from '../common/NotificationsPanel';
import { PageTransition } from '../animations/PageTransition';

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

  const toggleMobile = () => setMobileOpened((o) => !o);
  const toggleDesktop = () => setDesktopOpened((o) => !o);

  return (
    <AppShell
      header={{ height: { base: 60, md: 70 } }}
      navbar={{
        width: { base: 300, md: 300, lg: 300 },
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
          background: theme.colors.blue[7],
          color: theme.white,
        }}
      >
        <Flex h="100%" align="center" justify="space-between">
          <Group>
            <Burger
              opened={isMobile ? mobileOpened : desktopOpened}
              onClick={isMobile ? toggleMobile : toggleDesktop}
              size="sm"
              color={theme.white}
              aria-label="Toggle navigation"
            />
            <Title order={3} c="white">
              {title}
            </Title>
          </Group>

          <Group>
            <NotificationsPanel />
          </Group>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        withBorder
        style={{
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          transition: 'all 300ms ease',
        }}
      >
        {sidebar}
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          transition: 'padding 300ms ease',
        }}
      >
        <Box
          p={{ base: 'md', md: 'lg' }}
          style={{
            borderRadius: theme.radius.md,
            backgroundColor: theme.white,
            minHeight: `calc(100vh - ${rem(140)})`,
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
          }}
        >
          <PageTransition>{children}</PageTransition>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
