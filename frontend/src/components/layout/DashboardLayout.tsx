import { ReactNode } from 'react';
import { AppShell, Group, Box } from '@mantine/core';
import { NotificationsPanel } from '../common/NotificationsPanel';

interface DashboardLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
  return (
    <AppShell
      navbar={{ width: 280, breakpoint: 'sm' }}
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group justify="flex-end">
          <NotificationsPanel />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">{sidebar}</AppShell.Navbar>

      <AppShell.Main>
        <Box pt="md">{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
