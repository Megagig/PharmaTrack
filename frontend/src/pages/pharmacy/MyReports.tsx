import { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  Table,
  Button,
  Group,
  Select,
  Text,
  Modal,
  LoadingOverlay,
  Alert,
  Box,
} from '@mantine/core';
import { useAuthStore } from '../../store/authStore';
import { reportService, Report } from '../../services/reportService';

export function MyReports() {
  const { user } = useAuthStore();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [yearFilter, setYearFilter] = useState<string | null>('All Years');
  const [monthFilter, setMonthFilter] = useState<string | null>('All Months');

  // Get available years for filtering
  const getYears = () => {
    const years = new Set<string>();
    reports.forEach((report) => {
      const year = new Date(report.reportDate).getFullYear().toString();
      years.add(year);
    });
    return ['All Years', ...Array.from(years)];
  };

  // Get available months for filtering
  const getMonths = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return ['All Months', ...months];
  };

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      if (!user?.pharmacyId) {
        setLoading(false);
        return;
      }

      try {
        const data = await reportService.getReportsByPharmacy(user.pharmacyId);
        setReports(data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user?.pharmacyId]);

  // Filter reports based on selected year and month
  const filteredReports = reports.filter((report) => {
    const reportDate = new Date(report.reportDate);
    const reportYear = reportDate.getFullYear().toString();
    const reportMonth = reportDate.toLocaleString('default', { month: 'long' });

    const yearMatch = yearFilter === 'All Years' || reportYear === yearFilter;
    const monthMatch =
      monthFilter === 'All Months' || reportMonth === monthFilter;

    return yearMatch && monthMatch;
  });

  // Handle view report details
  const handleViewReport = async (id: string) => {
    setLoading(true);
    try {
      const report = await reportService.getReportById(id);
      setSelectedReport(report);
      setViewModalOpen(true);
    } catch (error: any) {
      setError(
        error.response?.data?.message || 'Failed to load report details'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title order={2} mb="lg">
        My Previous Reports
      </Title>

      {error && (
        <Alert color="red" mb="xl" withCloseButton onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Group mb="xl">
        <Select
          label="Filter by Year"
          placeholder="Select Year"
          data={getYears()}
          value={yearFilter}
          onChange={setYearFilter}
          style={{ flex: 1, maxWidth: 200 }}
        />

        <Select
          label="Filter by Month"
          placeholder="Select Month"
          data={getMonths()}
          value={monthFilter}
          onChange={setMonthFilter}
          style={{ flex: 1, maxWidth: 200 }}
        />
      </Group>

      <Paper withBorder pos="relative">
        <LoadingOverlay visible={loading} />

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Report Date</Table.Th>
              <Table.Th>Patients Served</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <Table.Tr key={report.id}>
                  <Table.Td>
                    {new Date(report.reportDate).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>{report.patientsServed}</Table.Td>
                  <Table.Td>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => handleViewReport(report.id)}
                    >
                      View Details
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3} style={{ textAlign: 'center' }}>
                  {loading ? 'Loading...' : 'No reports found'}
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Report Details Modal */}
      <Modal
        opened={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedReport(null);
        }}
        size="lg"
      >
        <Box>
          <Title order={2} mb="md">
            Report Details
          </Title>
          {selectedReport && (
            <div>
              <Group mb="md">
                <Text fw={500}>Total Patients:</Text>
                <Text>{selectedReport.patientsServed}</Text>
              </Group>

              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Patient Demographics
                </Text>
                <Group>
                  <Text>Male: {selectedReport.maleCount || 0}</Text>
                  <Text>Female: {selectedReport.femaleCount || 0}</Text>
                  <Text>Children: {selectedReport.childrenCount || 0}</Text>
                  <Text>Adults: {selectedReport.adultCount || 0}</Text>
                  <Text>Elderly: {selectedReport.elderlyCount || 0}</Text>
                </Group>
              </Paper>

              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Medications & Ailments
                </Text>
                <Text fw={500}>Top Medications:</Text>
                <Text mb="md">{selectedReport.topMedications.join(', ')}</Text>

                <Text fw={500}>Common Ailments:</Text>
                <Text mb="md">{selectedReport.commonAilments.join(', ')}</Text>

                <Text fw={500}>Adverse Drug Reactions:</Text>
                <Text mb="md">{selectedReport.adverseDrugReactions}</Text>

                <Text fw={500}>Adverse Reaction Details:</Text>
                <Text mb="md">
                  {selectedReport.adverseReactionDetails || 'None'}
                </Text>
              </Paper>

              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Public Health Activities
                </Text>
                <Group mb="md">
                  <Text>Referrals: {selectedReport.referralsMade}</Text>
                  <Text>
                    Immunizations: {selectedReport.immunizationsGiven || 0}
                  </Text>
                  <Text>
                    Health Education:{' '}
                    {selectedReport.healthEducationSessions || 0}
                  </Text>
                  <Text>BP Checks: {selectedReport.bpChecks || 0}</Text>
                </Group>
              </Paper>

              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Supply Chain Issues
                </Text>
                <Group mb="md">
                  <Text>
                    Expired Drugs: {selectedReport.expiredDrugs ? 'Yes' : 'No'}
                  </Text>
                  <Text>
                    Stockouts: {selectedReport.stockouts ? 'Yes' : 'No'}
                  </Text>
                  <Text>
                    Supply Delays: {selectedReport.supplyDelays ? 'Yes' : 'No'}
                  </Text>
                </Group>
              </Paper>

              {/* Service Delivery Data */}
              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Service Delivery Data
                </Text>
                <Group mb="md">
                  <Text>
                    Prescriptions Filled:{' '}
                    {selectedReport.prescriptionsFilled || 0}
                  </Text>
                  <Text>
                    OTC Consultations: {selectedReport.otcConsultations || 0}
                  </Text>
                  <Text>
                    MTM Interventions: {selectedReport.mtmInterventions || 0}
                  </Text>
                </Group>
              </Paper>

              {/* Economic Contribution */}
              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Economic Contribution
                </Text>
                <Group mb="md">
                  <Text>
                    Monthly Revenue: ₦
                    {selectedReport.monthlyRevenue?.toLocaleString() || 0}
                  </Text>
                  <Text>
                    Taxes Paid: ₦
                    {selectedReport.taxesPaid?.toLocaleString() || 0}
                  </Text>
                </Group>
                <Text fw={500} mb="xs">
                  Staff:
                </Text>
                <Group mb="md">
                  <Text>
                    Pharmacists: {selectedReport.staffPharmacists || 0}
                  </Text>
                  <Text>
                    Technicians: {selectedReport.staffTechnicians || 0}
                  </Text>
                  <Text>Others: {selectedReport.staffOthers || 0}</Text>
                  <Text>
                    Local Suppliers: {selectedReport.localSuppliersCount || 0}
                  </Text>
                </Group>
              </Paper>

              {/* Challenges and Barriers */}
              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Challenges and Barriers
                </Text>
                <Group mb="md">
                  <Text>
                    Regulatory Compliance Cost: ₦
                    {selectedReport.regulatoryComplianceCost?.toLocaleString() ||
                      0}
                  </Text>
                  <Text>
                    Fake/Substandard Drugs:{' '}
                    {selectedReport.fakeOrSubstandardDrugs || 0}
                  </Text>
                  <Text>
                    Rejected Insurance Claims:{' '}
                    {selectedReport.rejectedInsuranceClaims || 0}
                  </Text>
                </Group>
                <Group mb="md">
                  <Text>
                    Access to Subsidized Medicines:{' '}
                    {selectedReport.hasSubsidizedMedicines ? 'Yes' : 'No'}
                  </Text>
                  <Text>
                    Insurance Inclusion Issues:{' '}
                    {selectedReport.insuranceInclusionIssues ? 'Yes' : 'No'}
                  </Text>
                </Group>
              </Paper>

              {/* Public Health Partnerships */}
              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Public Health Partnerships
                </Text>
                <Text>
                  {selectedReport.publicHealthPartnerships?.length
                    ? selectedReport.publicHealthPartnerships.join(', ')
                    : 'No partnerships reported'}
                </Text>
              </Paper>

              {/* Technology and Digital Adoption */}
              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Technology and Digital Adoption
                </Text>
                <Group mb="md">
                  <Text>
                    Electronic Records:{' '}
                    {selectedReport.usesElectronicRecords ? 'Yes' : 'No'}
                  </Text>
                  <Text>
                    Mobile Health:{' '}
                    {selectedReport.usesMobileHealth ? 'Yes' : 'No'}
                  </Text>
                  <Text>
                    Inventory Management:{' '}
                    {selectedReport.usesInventoryManagement ? 'Yes' : 'No'}
                  </Text>
                </Group>
              </Paper>

              {/* Community Feedback */}
              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Community Feedback
                </Text>
                <Group mb="md">
                  <Text>
                    Patient Satisfaction Score:{' '}
                    {selectedReport.patientSatisfactionScore || 'N/A'}/10
                  </Text>
                  <Text>
                    Time Saved vs Hospital:{' '}
                    {selectedReport.timeComparedToHospital || 0} minutes
                  </Text>
                </Group>
              </Paper>

              <Text fw={500} mt="lg">
                Notes:
              </Text>
              <Text>{selectedReport.notes || 'No additional notes'}</Text>

              <Group justify="flex-end" mt="xl">
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewModalOpen(false);
                    setSelectedReport(null);
                  }}
                >
                  Close
                </Button>
              </Group>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
