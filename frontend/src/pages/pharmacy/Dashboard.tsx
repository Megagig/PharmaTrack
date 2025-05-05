import { Title, Paper, SimpleGrid, Text, Card, Alert, Button, Group } from '@mantine/core';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuthStore();
  
  // This would be fetched from the API in a real implementation
  const mockPharmacyData = {
    name: 'Community Pharmacy',
    address: '123 Health Street, Ward 2, LGA 1',
    pharmacist: 'Jane Smith',
    lastReportDate: '2023-05-15',
    reportsSubmitted: 5,
    patientsServed: 450,
  };

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  return (
    <div>
      <Title order={2} mb="lg">Pharmacy Dashboard</Title>
      
      <Alert color="blue" mb="xl">
        <Group justify="space-between">
          <div>
            <Text fw={500}>Monthly Report Reminder</Text>
            <Text size="sm">Don't forget to submit your report for {currentMonth} {currentYear}.</Text>
          </div>
          <Button component={Link} to="/pharmacy/submit-report">Submit Now</Button>
        </Group>
      </Alert>
      
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Total Reports Submitted</Text>
          <Title order={3} mt="md">{mockPharmacyData.reportsSubmitted}</Title>
        </Card>
        
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Last Report Date</Text>
          <Title order={3} mt="md">{mockPharmacyData.lastReportDate}</Title>
        </Card>
        
        <Card withBorder p="xl" radius="md">
          <Text fz="lg" fw={500} c="dimmed">Total Patients Served</Text>
          <Title order={3} mt="md">{mockPharmacyData.patientsServed}</Title>
        </Card>
      </SimpleGrid>
      
      <Paper withBorder p="md" mt="xl">
        <Title order={3} mb="md">Pharmacy Information</Title>
        <Text><strong>Name:</strong> {mockPharmacyData.name}</Text>
        <Text><strong>Address:</strong> {mockPharmacyData.address}</Text>
        <Text><strong>Pharmacist in Charge:</strong> {mockPharmacyData.pharmacist}</Text>
      </Paper>
      
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mt="xl">
        <Paper withBorder p="md">
          <Title order={3} mb="md">Recent Activity</Title>
          <Text>Activity timeline will be implemented here...</Text>
        </Paper>
        
        <Paper withBorder p="md">
          <Title order={3} mb="md">Quick Actions</Title>
          <Group>
            <Button component={Link} to="/pharmacy/submit-report">Submit Report</Button>
            <Button component={Link} to="/pharmacy/my-reports" variant="outline">View Reports</Button>
            <Button component={Link} to="/pharmacy/profile" variant="outline">Update Profile</Button>
          </Group>
        </Paper>
      </SimpleGrid>
    </div>
  );
}
