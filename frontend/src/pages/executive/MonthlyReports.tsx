import { Title, Paper, Table, Group, Select, Button } from '@mantine/core';

export function MonthlyReports() {
  // This would be fetched from the API in a real implementation
  const mockReports = [
    { id: '1', pharmacy: 'Pharmacy A', date: '2023-06-15', patientsServed: 120, ward: 'Ward 1', lga: 'LGA 1' },
    { id: '2', pharmacy: 'Pharmacy B', date: '2023-06-12', patientsServed: 85, ward: 'Ward 2', lga: 'LGA 1' },
    { id: '3', pharmacy: 'Pharmacy C', date: '2023-06-10', patientsServed: 95, ward: 'Ward 1', lga: 'LGA 2' },
  ];

  return (
    <div>
      <Title order={2} mb="lg">Monthly Reports</Title>
      
      <Group mb="xl">
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
        
        <Select
          label="Filter by Month"
          placeholder="Select Month"
          data={['June 2023', 'May 2023', 'April 2023', 'March 2023']}
          defaultValue="June 2023"
          style={{ flex: 1 }}
        />
      </Group>
      
      <Paper withBorder>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Pharmacy</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Patients Served</Table.Th>
              <Table.Th>Ward</Table.Th>
              <Table.Th>LGA</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockReports.map((report) => (
              <Table.Tr key={report.id}>
                <Table.Td>{report.pharmacy}</Table.Td>
                <Table.Td>{report.date}</Table.Td>
                <Table.Td>{report.patientsServed}</Table.Td>
                <Table.Td>{report.ward}</Table.Td>
                <Table.Td>{report.lga}</Table.Td>
                <Table.Td>
                  <Button size="xs" variant="outline">View Details</Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}
