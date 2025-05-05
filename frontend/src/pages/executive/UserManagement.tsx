import { Title, Paper, Table, Button, Group, TextInput, Select } from '@mantine/core';

export function UserManagement() {
  // This would be fetched from the API in a real implementation
  const mockUsers = [
    { id: '1', email: 'admin@example.com', role: 'ADMIN', pharmacy: 'N/A' },
    { id: '2', email: 'executive@example.com', role: 'EXECUTIVE', pharmacy: 'N/A' },
    { id: '3', email: 'pharmacy1@example.com', role: 'PHARMACY', pharmacy: 'Pharmacy A' },
    { id: '4', email: 'pharmacy2@example.com', role: 'PHARMACY', pharmacy: 'Pharmacy B' },
  ];

  return (
    <div>
      <Title order={2} mb="lg">User Management</Title>
      
      <Group mb="md">
        <TextInput placeholder="Search users..." style={{ flex: 1 }} />
        <Select
          placeholder="Filter by Role"
          data={['All Roles', 'ADMIN', 'EXECUTIVE', 'PHARMACY']}
          defaultValue="All Roles"
        />
        <Button>Add User</Button>
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
                    <Button size="xs" variant="outline">Edit</Button>
                    <Button size="xs" variant="outline" color="red">Delete</Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}
