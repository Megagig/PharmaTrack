import { NavLink } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

export function SidebarItem({ icon, label, to }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      component={Link}
      to={to}
      label={label}
      leftSection={icon}
      active={isActive}
      variant="filled"
    />
  );
}
