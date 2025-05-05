import { Title, Paper, SimpleGrid, Text, Card, Select, Group } from '@mantine/core';

export function PublicHealthActivities() {
  return (
    <div>
      <Title order={2} mb="lg">Public Health Activities</Title>
      
      <Group mb="xl">
        <Select
          label="Filter by LGA"
          placeholder="Select LGA"
          data={['All LGAs', 'LGA 1', 'LGA 2', 'LGA 3']}
          defaultValue="All LGAs"
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
      
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Health Education Sessions</Text>
          <Title order={3} mt="md">156</Title>
        </Card>
        
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Immunizations Given</Text>
          <Title order={3} mt="md">432</Title>
        </Card>
        
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">BP Checks</Text>
          <Title order={3} mt="md">1,245</Title>
        </Card>
        
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Referrals Made</Text>
          <Title order={3} mt="md">89</Title>
        </Card>
      </SimpleGrid>
      
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Paper withBorder p="md">
          <Title order={3} mb="md">Health Education by Topic</Title>
          <Text>Chart will be implemented here...</Text>
        </Paper>
        
        <Paper withBorder p="md">
          <Title order={3} mb="md">Immunization Trends</Title>
          <Text>Chart will be implemented here...</Text>
        </Paper>
        
        <Paper withBorder p="md">
          <Title order={3} mb="md">BP Check Results</Title>
          <Text>Chart will be implemented here...</Text>
        </Paper>
        
        <Paper withBorder p="md">
          <Title order={3} mb="md">Referral Reasons</Title>
          <Text>Chart will be implemented here...</Text>
        </Paper>
      </SimpleGrid>
    </div>
  );
}
