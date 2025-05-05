import { Title, Paper, TextInput, Button, PasswordInput, Divider, Switch, Group, Stack } from '@mantine/core';

export function Settings() {
  return (
    <div>
      <Title order={2} mb="lg">Settings</Title>
      
      <Paper withBorder p="md" mb="xl">
        <Title order={3} mb="md">Account Settings</Title>
        
        <Stack gap="md">
          <TextInput
            label="Email"
            defaultValue="executive@example.com"
            readOnly
          />
          
          <PasswordInput
            label="Current Password"
            placeholder="Enter your current password"
          />
          
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
          />
          
          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm new password"
          />
          
          <Button style={{ alignSelf: 'flex-start' }}>Update Password</Button>
        </Stack>
      </Paper>
      
      <Paper withBorder p="md">
        <Title order={3} mb="md">Notification Settings</Title>
        
        <Stack gap="md">
          <Switch
            label="Email notifications for new pharmacy registrations"
            defaultChecked
          />
          
          <Switch
            label="Email notifications for non-compliant pharmacies"
            defaultChecked
          />
          
          <Switch
            label="Email notifications for system updates"
            defaultChecked
          />
          
          <Divider my="md" />
          
          <Group justify="flex-end">
            <Button>Save Settings</Button>
          </Group>
        </Stack>
      </Paper>
    </div>
  );
}
