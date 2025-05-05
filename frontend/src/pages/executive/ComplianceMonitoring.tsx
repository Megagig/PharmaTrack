import { Title, Paper, SimpleGrid, Text, Card, Table, Group, Select } from '@mantine/core';

export function ComplianceMonitoring() {
  // This would be fetched from the API in a real implementation
  const mockNonCompliantPharmacies = [
    { id: '1', name: 'Pharmacy D', lastReport: '2023-04-15', ward: 'Ward 3', lga: 'LGA 2' },
    { id: '2', name: 'Pharmacy E', lastReport: '2023-05-02', ward: 'Ward 1', lga: 'LGA 3' },
    { id: '3', name: 'Pharmacy F', lastReport: 'Never', ward: 'Ward 2', lga: 'LGA 1' },
  ];

  return (
    <div>
      <Title order={2} mb="lg">Compliance Monitoring</Title>
      
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" mb="xl">
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Overall Compliance</Text>
          <Title order={3} mt="md">76%</Title>
        </Card>
        
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Non-Compliant Pharmacies</Text>
          <Title order={3} mt="md">32</Title>
        </Card>
        
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Never Submitted</Text>
          <Title order={3} mt="md">8</Title>
        </Card>
      </SimpleGrid>
      
      <Group mb="md">
        <Select
          label="Filter by LGA"
          placeholder="Select LGA"
          data={['All LGAs', 'LGA 1', 'LGA 2', 'LGA 3']}
          defaultValue="All LGAs"
          style={{ flex: 1 }}
        />
        
        <Select
          label="Filter by Ward"
          placeholder="Select Ward"
          data={['All Wards', 'Ward 1', 'Ward 2', 'Ward 3']}
          defaultValue="All Wards"
          style={{ flex: 1 }}
        />
      </Group>
      
      <Paper withBorder p="md">
        <Title order={3} mb="md">Pharmacies Not Submitted</Title>
        
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Pharmacy Name</Table.Th>
              <Table.Th>Last Report</Table.Th>
              <Table.Th>Ward</Table.Th>
              <Table.Th>LGA</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockNonCompliantPharmacies.map((pharmacy) => (
              <Table.Tr key={pharmacy.id}>
                <Table.Td>{pharmacy.name}</Table.Td>
                <Table.Td>{pharmacy.lastReport}</Table.Td>
                <Table.Td>{pharmacy.ward}</Table.Td>
                <Table.Td>{pharmacy.lga}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}
