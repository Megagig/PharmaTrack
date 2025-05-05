import { Title, Paper, SimpleGrid, Text, Select, Group } from '@mantine/core';

export function MedicationsTrends() {
  return (
    <div>
      <Title order={2} mb="lg">Medications & Ailments Trends</Title>
      
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
          label="Time Period"
          placeholder="Select Period"
          data={['Last Month', 'Last 3 Months', 'Last 6 Months', 'Last Year']}
          defaultValue="Last Month"
          style={{ flex: 1 }}
        />
      </Group>
      
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Paper withBorder p="md">
          <Title order={3} mb="md">Top Medications</Title>
          <Text>Chart will be implemented here...</Text>
        </Paper>
        
        <Paper withBorder p="md">
          <Title order={3} mb="md">Common Ailments</Title>
          <Text>Chart will be implemented here...</Text>
        </Paper>
        
        <Paper withBorder p="md">
          <Title order={3} mb="md">Adverse Drug Reactions</Title>
          <Text>Chart will be implemented here...</Text>
        </Paper>
        
        <Paper withBorder p="md">
          <Title order={3} mb="md">Medication Usage by Age Group</Title>
          <Text>Chart will be implemented here...</Text>
        </Paper>
      </SimpleGrid>
    </div>
  );
}
