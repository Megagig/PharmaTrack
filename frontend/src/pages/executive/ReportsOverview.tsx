import { Title, Paper, SimpleGrid, Text, Card, Select } from '@mantine/core';

export function ReportsOverview() {
  return (
    <div>
      <Title order={2} mb="lg">Reports Overview</Title>
      
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="xl">
        <Select
          label="Filter by LGA"
          placeholder="Select LGA"
          data={['All LGAs', 'LGA 1', 'LGA 2', 'LGA 3']}
          defaultValue="All LGAs"
        />
        
        <Select
          label="Filter by Month"
          placeholder="Select Month"
          data={['All Months', 'January', 'February', 'March', 'April', 'May', 'June']}
          defaultValue="All Months"
        />
      </SimpleGrid>
      
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Total Reports</Text>
          <Title order={3} mt="md">248</Title>
        </Card>
        
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Patients Served</Text>
          <Title order={3} mt="md">12,450</Title>
        </Card>
        
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Avg. Reports per Pharmacy</Text>
          <Title order={3} mt="md">8.2</Title>
        </Card>
      </SimpleGrid>
      
      <Paper withBorder p="md" mt="xl">
        <Title order={3} mb="md">Reports Summary</Title>
        <Text>Reports overview content will be implemented here...</Text>
      </Paper>
    </div>
  );
}
