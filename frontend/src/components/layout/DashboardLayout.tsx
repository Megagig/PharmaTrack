import { ReactNode } from 'react';
import { AppShell } from '@mantine/core';

interface DashboardLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
  return (
    <AppShell
      navbar={{ width: 280, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        {sidebar}
      </AppShell.Navbar>
      
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
