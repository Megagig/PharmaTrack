import { useState } from 'react';
import {
  Popover,
  ActionIcon,
  Badge,
  Stack,
  Text,
  Group,
  Button,
  Divider,
  Paper,
  useMantineTheme,
} from '@mantine/core';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export function NotificationsPanel() {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  // This would be fetched from the API in a real implementation
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Report Reminder',
      message: 'Your monthly report for June 2023 is due in 3 days.',
      date: '2023-06-27',
      read: false,
      type: 'warning',
    },
    {
      id: '2',
      title: 'System Update',
      message:
        'PharmaTrack will be undergoing maintenance on July 2nd from 2-4 AM.',
      date: '2023-06-25',
      read: false,
      type: 'info',
    },
    {
      id: '3',
      title: 'Report Submitted',
      message: 'Your May 2023 report has been successfully processed.',
      date: '2023-06-10',
      read: true,
      type: 'success',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'yellow';
      case 'success':
        return 'green';
      case 'info':
      default:
        return 'blue';
    }
  };

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      width={320}
      position="bottom-end"
      shadow="md"
    >
      <Popover.Target>
        <div style={{ position: 'relative' }}>
          <ActionIcon
            variant="transparent"
            radius="xl"
            size="lg"
            onClick={() => setOpened((o) => !o)}
            color="white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </ActionIcon>
          {unreadCount > 0 && (
            <Badge
              color="red"
              size="xs"
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
              }}
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </Popover.Target>

      <Popover.Dropdown>
        <Group justify="space-between" mb="xs">
          <Text fw={500}>Notifications</Text>
          {unreadCount > 0 && (
            <Button variant="subtle" compact onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </Group>

        <Divider mb="md" />

        <Stack gap="xs" style={{ maxHeight: '400px', overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Text c="dimmed" ta="center">
              No notifications
            </Text>
          ) : (
            notifications.map((notification) => (
              <Paper
                key={notification.id}
                withBorder
                p="sm"
                style={{
                  opacity: notification.read ? 0.7 : 1,
                  borderLeft: `4px solid var(--mantine-color-${getNotificationColor(
                    notification.type
                  )}-filled)`,
                  transition: 'all 200ms ease',
                  boxShadow: notification.read
                    ? 'none'
                    : '0 2px 5px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Group justify="space-between" mb="xs">
                  <Text fw={500} size="sm">
                    {notification.title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {notification.date}
                  </Text>
                </Group>
                <Text size="sm" mb="xs">
                  {notification.message}
                </Text>
                {!notification.read && (
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => markAsRead(notification.id)}
                    color={getNotificationColor(notification.type)}
                  >
                    Mark as read
                  </Button>
                )}
              </Paper>
            ))
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
