import {
  Title,
  Paper,
  Table,
  Button,
  Group,
  TextInput,
  Select,
  Modal,
  Box,
  Stack,
  PasswordInput,
} from '@mantine/core';
import { useState } from 'react';

export function UserManagement() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // This would be fetched from the API in a real implementation
  const mockUsers = [
    { id: '1', email: 'admin@example.com', role: 'ADMIN', pharmacy: 'N/A' },
    {
      id: '2',
      email: 'executive@example.com',
      role: 'EXECUTIVE',
      pharmacy: 'N/A',
    },
    {
      id: '3',
      email: 'pharmacy1@example.com',
      role: 'PHARMACY',
      pharmacy: 'Pharmacy A',
    },
    {
      id: '4',
      email: 'pharmacy2@example.com',
      role: 'PHARMACY',
      pharmacy: 'Pharmacy B',
    },
  ];

  return (
    <div>
      <Title order={2} mb="lg">
        User Management
      </Title>

      <Group mb="md">
        <TextInput placeholder="Search users..." style={{ flex: 1 }} />
        <Select
          placeholder="Filter by Role"
          data={['All Roles', 'ADMIN', 'EXECUTIVE', 'PHARMACY']}
          defaultValue="All Roles"
        />
        <Button onClick={() => setAddModalOpen(true)}>Add User</Button>
      </Group>

      <Paper withBorder>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Email</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Pharmacy</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockUsers.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{user.role}</Table.Td>
                <Table.Td>{user.pharmacy}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => setEditModalOpen(true)}
                    >
                      Edit
                    </Button>
                    <Button size="xs" variant="outline" color="red">
                      Delete
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Add User Modal */}
      <Modal opened={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <Box>
          <Title order={2} mb="md">
            Add New User
          </Title>
          <Stack>
            <TextInput label="Email" placeholder="Enter email" required />
            <PasswordInput
              label="Password"
              placeholder="Enter password"
              required
            />
            <Select
              label="Role"
              placeholder="Select role"
              data={[
                { value: 'ADMIN', label: 'Administrator' },
                { value: 'EXECUTIVE', label: 'Executive' },
                { value: 'PHARMACY', label: 'Pharmacy' },
              ]}
              required
            />
            <Select
              label="Pharmacy"
              placeholder="Select pharmacy"
              data={[
                { value: '1', label: 'Pharmacy A' },
                { value: '2', label: 'Pharmacy B' },
              ]}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button>Add User</Button>
            </Group>
          </Stack>
        </Box>
      </Modal>

      {/* Edit User Modal */}
      <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box>
          <Title order={2} mb="md">
            Edit User
          </Title>
          <Stack>
            <TextInput label="Email" placeholder="Enter email" required />
            <Select
              label="Role"
              placeholder="Select role"
              data={[
                { value: 'ADMIN', label: 'Administrator' },
                { value: 'EXECUTIVE', label: 'Executive' },
                { value: 'PHARMACY', label: 'Pharmacy' },
              ]}
              required
            />
            <Select
              label="Pharmacy"
              placeholder="Select pharmacy"
              data={[
                { value: '1', label: 'Pharmacy A' },
                { value: '2', label: 'Pharmacy B' },
              ]}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </Group>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
