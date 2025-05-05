import { Title, Paper, Table, Button, Group, TextInput } from '@mantine/core';

export function AllPharmacies() {
  // This would be fetched from the API in a real implementation
  const mockPharmacies = [
    { id: '1', name: 'Pharmacy A', ward: 'Ward 1', lga: 'LGA 1', pharmacist: 'John Doe' },
    { id: '2', name: 'Pharmacy B', ward: 'Ward 2', lga: 'LGA 1', pharmacist: 'Jane Smith' },
    { id: '3', name: 'Pharmacy C', ward: 'Ward 1', lga: 'LGA 2', pharmacist: 'Bob Johnson' },
  ];

  return (
    <div>
      <Title order={2} mb="lg">All Pharmacies</Title>
      
      <Group mb="md">
        <TextInput placeholder="Search pharmacies..." style={{ flex: 1 }} />
        <Button>Add Pharmacy</Button>
      </Group>
      
      <Paper withBorder>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Ward</Table.Th>
              <Table.Th>LGA</Table.Th>
              <Table.Th>Pharmacist</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockPharmacies.map((pharmacy) => (
              <Table.Tr key={pharmacy.id}>
                <Table.Td>{pharmacy.name}</Table.Td>
                <Table.Td>{pharmacy.ward}</Table.Td>
                <Table.Td>{pharmacy.lga}</Table.Td>
                <Table.Td>{pharmacy.pharmacist}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button size="xs" variant="outline">View</Button>
                    <Button size="xs" variant="outline">Edit</Button>
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
