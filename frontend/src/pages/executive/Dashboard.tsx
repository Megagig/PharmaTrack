import { Title, Paper, SimpleGrid, Text, Card } from '@mantine/core';

export function Dashboard() {
  return (
    <div>
      <Title order={2} mb="lg">Executive Dashboard</Title>
      
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Total Pharmacies</Text>
          <Title order={3} mt="md">124</Title>
        </Card>
        
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Reports This Month</Text>
          <Title order={3} mt="md">87</Title>
        </Card>
        
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Compliance Rate</Text>
          <Title order={3} mt="md">76%</Title>
        </Card>
        
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Patients Served</Text>
          <Title order={3} mt="md">5,280</Title>
        </Card>
      </SimpleGrid>
      
      <Paper withBorder p="md" mt="xl">
        <Title order={3} mb="md">Recent Activity</Title>
        <Text>Dashboard content will be implemented here...</Text>
      </Paper>
    </div>
  );
}
