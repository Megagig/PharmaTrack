import { useState } from 'react';
import {
  Popover,
  ActionIcon,
  Badge,
  Stack,
  Text,
  Group,
  Button,
  Paper,
  useMantineTheme,
  Box,
} from '@mantine/core';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
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
      timestamp: '2023-06-27',
      read: false,
      type: 'warning',
    },
    {
      id: '2',
      title: 'System Update',
      message:
        'PharmaTrack will be undergoing maintenance on July 2nd from 2-4 AM.',
      timestamp: '2023-06-25',
      read: false,
      type: 'info',
    },
    {
      id: '3',
      title: 'Report Submitted',
      message: 'Your May 2023 report has been successfully processed.',
      timestamp: '2023-06-10',
      read: true,
      type: 'success',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const formatNotificationTime = (timestamp: string) => {
    return timestamp; // Placeholder for formatting logic
  };

  return (
    <Popover position="bottom-end" shadow="md">
      <Popover.Target>
        <ActionIcon variant="subtle" color="white" size="lg">
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
          {unreadCount > 0 && (
            <Badge
              color="red"
              size="xs"
              style={{ position: 'absolute', top: -5, right: -5 }}
            >
              {unreadCount}
            </Badge>
          )}
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <Box w={300}>
          <Group justify="space-between" mb="md">
            <Text fw={700} size="lg">
              Notifications
            </Text>
            {notifications.length > 0 && (
              <Button variant="subtle" compact onClick={handleMarkAllRead}>
                Mark all as read
              </Button>
            )}
          </Group>

          <Stack>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Paper
                  key={notification.id}
                  withBorder
                  p="xs"
                  style={{
                    opacity: notification.read ? 0.7 : 1,
                    backgroundColor: notification.read
                      ? 'transparent'
                      : theme.colors.blue[0],
                  }}
                >
                  <Group position="apart" mb={4}>
                    <Text size="sm" fw={500}>
                      {notification.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formatNotificationTime(notification.timestamp)}
                    </Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {notification.message}
                  </Text>
                </Paper>
              ))
            ) : (
              <Text c="dimmed" ta="center">
                No notifications
              </Text>
            )}
          </Stack>

          {notifications.length > 0 && (
            <Button variant="light" fullWidth mt="md">
              View all notifications
            </Button>
          )}
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
}
