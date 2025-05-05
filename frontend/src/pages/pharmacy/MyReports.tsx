import { useState } from 'react';
import { Title, Paper, Table, Button, Group, Select, Text, Modal } from '@mantine/core';

export function MyReports() {
  const [viewReportId, setViewReportId] = useState<string | null>(null);
  
  // This would be fetched from the API in a real implementation
  const mockReports = [
    { id: '1', date: '2023-06-15', patientsServed: 120, status: 'Submitted' },
    { id: '2', date: '2023-05-12', patientsServed: 85, status: 'Submitted' },
    { id: '3', date: '2023-04-10', patientsServed: 95, status: 'Submitted' },
    { id: '4', date: '2023-03-08', patientsServed: 110, status: 'Submitted' },
    { id: '5', date: '2023-02-14', patientsServed: 75, status: 'Submitted' },
  ];
  
  // Find the selected report for the modal
  const selectedReport = mockReports.find(report => report.id === viewReportId);
  
  // Mock detailed report data
  const mockDetailedReport = {
    id: viewReportId,
    date: selectedReport?.date || '',
    patientsServed: selectedReport?.patientsServed || 0,
    maleCount: 45,
    femaleCount: 75,
    childrenCount: 30,
    adultCount: 70,
    elderlyCount: 20,
    topMedications: ['Paracetamol', 'Amoxicillin', 'Ibuprofen'],
    commonAilments: ['Malaria', 'Upper Respiratory Infection', 'Hypertension'],
    adverseDrugReactions: 2,
    adverseReactionDetails: 'Mild skin rash from amoxicillin in two patients.',
    referralsMade: 5,
    immunizationsGiven: 15,
    healthEducationSessions: 3,
    bpChecks: 40,
    expiredDrugs: false,
    stockouts: true,
    supplyDelays: false,
    notes: 'Experienced stockouts of antimalarial medications for 3 days.',
  };

  return (
    <div>
      <Title order={2} mb="lg">My Previous Reports</Title>
      
      <Group mb="xl">
        <Select
          label="Filter by Year"
          placeholder="Select Year"
          data={['All Years', '2023', '2022', '2021']}
          defaultValue="All Years"
          style={{ flex: 1, maxWidth: 200 }}
        />
        
        <Select
          label="Filter by Month"
          placeholder="Select Month"
          data={['All Months', 'January', 'February', 'March', 'April', 'May', 'June']}
          defaultValue="All Months"
          style={{ flex: 1, maxWidth: 200 }}
        />
      </Group>
      
      <Paper withBorder>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Report Date</Table.Th>
              <Table.Th>Patients Served</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockReports.map((report) => (
              <Table.Tr key={report.id}>
                <Table.Td>{report.date}</Table.Td>
                <Table.Td>{report.patientsServed}</Table.Td>
                <Table.Td>{report.status}</Table.Td>
                <Table.Td>
                  <Button size="xs" variant="outline" onClick={() => setViewReportId(report.id)}>
                    View Details
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
      
      {/* Report Details Modal */}
      <Modal 
        opened={!!viewReportId} 
        onClose={() => setViewReportId(null)}
        title={<Title order={3}>Report Details - {mockDetailedReport.date}</Title>}
        size="lg"
      >
        <div>
          <Group mb="md">
            <Text fw={500}>Total Patients:</Text>
            <Text>{mockDetailedReport.patientsServed}</Text>
          </Group>
          
          <Title order={4} mt="lg">Patient Demographics</Title>
          <Group mb="md">
            <Text>Male: {mockDetailedReport.maleCount}</Text>
            <Text>Female: {mockDetailedReport.femaleCount}</Text>
            <Text>Children: {mockDetailedReport.childrenCount}</Text>
            <Text>Adults: {mockDetailedReport.adultCount}</Text>
            <Text>Elderly: {mockDetailedReport.elderlyCount}</Text>
          </Group>
          
          <Title order={4} mt="lg">Medications & Ailments</Title>
          <Text fw={500}>Top Medications:</Text>
          <Text mb="md">{mockDetailedReport.topMedications.join(', ')}</Text>
          
          <Text fw={500}>Common Ailments:</Text>
          <Text mb="md">{mockDetailedReport.commonAilments.join(', ')}</Text>
          
          <Text fw={500}>Adverse Drug Reactions:</Text>
          <Text mb="md">{mockDetailedReport.adverseDrugReactions}</Text>
          
          <Text fw={500}>Adverse Reaction Details:</Text>
          <Text mb="md">{mockDetailedReport.adverseReactionDetails}</Text>
          
          <Title order={4} mt="lg">Public Health Activities</Title>
          <Group mb="md">
            <Text>Referrals: {mockDetailedReport.referralsMade}</Text>
            <Text>Immunizations: {mockDetailedReport.immunizationsGiven}</Text>
            <Text>Health Education: {mockDetailedReport.healthEducationSessions}</Text>
            <Text>BP Checks: {mockDetailedReport.bpChecks}</Text>
          </Group>
          
          <Title order={4} mt="lg">Supply Chain Issues</Title>
          <Group mb="md">
            <Text>Expired Drugs: {mockDetailedReport.expiredDrugs ? 'Yes' : 'No'}</Text>
            <Text>Stockouts: {mockDetailedReport.stockouts ? 'Yes' : 'No'}</Text>
            <Text>Supply Delays: {mockDetailedReport.supplyDelays ? 'Yes' : 'No'}</Text>
          </Group>
          
          <Text fw={500}>Notes:</Text>
          <Text>{mockDetailedReport.notes}</Text>
          
          <Group justify="flex-end" mt="xl">
            <Button variant="outline" onClick={() => setViewReportId(null)}>Close</Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
}
