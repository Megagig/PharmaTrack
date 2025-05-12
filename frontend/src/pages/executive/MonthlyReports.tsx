import { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  Table,
  Group,
  Select,
  Button,
  Modal,
  Box,
  Text,
  Alert,
  LoadingOverlay,
} from '@mantine/core';
import { reportService, Report } from '../../services/reportService';
import { pharmacyService } from '../../services/pharmacyService';

export function MonthlyReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [lgaFilter, setLgaFilter] = useState<string | null>('All LGAs');
  const [wardFilter, setWardFilter] = useState<string | null>('All Wards');
  const [monthFilter, setMonthFilter] = useState<string | null>(
    getCurrentMonth()
  );
  const [lgas, setLgas] = useState<string[]>(['All LGAs']);
  const [wards, setWards] = useState<string[]>(['All Wards']);

  // Get current month in format "MMMM YYYY"
  function getCurrentMonth() {
    const date = new Date();
    return `${date.toLocaleString('default', {
      month: 'long',
    })} ${date.getFullYear()}`;
  }

  // Get last 12 months for filter
  function getMonths() {
    const months = [];
    const current = new Date();

    for (let i = 0; i < 12; i++) {
      const month = new Date(current.getFullYear(), current.getMonth() - i, 1);
      months.push(
        `${month.toLocaleString('default', {
          month: 'long',
        })} ${month.getFullYear()}`
      );
    }
    return months;
  }

  // Fetch reports and location data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Calculate date range based on month filter
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 12); // Get last 12 months of data

        // Fetch reports
        const reportsData = await reportService.getReportsByDateRange(
          startDate,
          endDate
        );
        setReports(reportsData);
        setFilteredReports(reportsData);

        // Fetch pharmacies to get unique LGAs and wards
        const pharmacies = await pharmacyService.getAllPharmacies();

        // Extract unique LGAs and wards
        const uniqueLgas = new Set<string>();
        const uniqueWards = new Set<string>();
        pharmacies.forEach((pharmacy) => {
          uniqueLgas.add(pharmacy.lga);
          uniqueWards.add(pharmacy.ward);
        });

        setLgas(['All LGAs', ...Array.from(uniqueLgas)]);
        setWards(['All Wards', ...Array.from(uniqueWards)]);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter reports based on selected filters
  useEffect(() => {
    let filtered = [...reports];

    // Apply LGA filter
    if (lgaFilter && lgaFilter !== 'All LGAs') {
      filtered = filtered.filter(
        (report) => report.pharmacy?.lga === lgaFilter
      );
    }

    // Apply ward filter
    if (wardFilter && wardFilter !== 'All Wards') {
      filtered = filtered.filter(
        (report) => report.pharmacy?.ward === wardFilter
      );
    }

    // Apply month filter
    if (monthFilter) {
      const [filterMonth, filterYear] = monthFilter.split(' ');
      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.reportDate);
        return (
          reportDate.getFullYear().toString() === filterYear &&
          reportDate.toLocaleString('default', { month: 'long' }) ===
            filterMonth
        );
      });
    }

    setFilteredReports(filtered);
  }, [reports, lgaFilter, wardFilter, monthFilter]);

  return (
    <div>
      <Title order={2} mb="lg">
        Monthly Reports
      </Title>

      {error && (
        <Alert color="red" mb="xl" withCloseButton onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Group mb="xl">
        <Select
          label="Filter by LGA"
          placeholder="Select LGA"
          data={lgas}
          value={lgaFilter}
          onChange={setLgaFilter}
          style={{ flex: 1 }}
        />

        <Select
          label="Filter by Ward"
          placeholder="Select Ward"
          data={wards}
          value={wardFilter}
          onChange={setWardFilter}
          style={{ flex: 1 }}
        />

        <Select
          label="Filter by Month"
          placeholder="Select Month"
          data={getMonths()}
          value={monthFilter}
          onChange={setMonthFilter}
          style={{ flex: 1 }}
        />
      </Group>

      <Paper withBorder pos="relative">
        <LoadingOverlay visible={loading} />
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
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <Table.Tr key={report.id}>
                  <Table.Td>{report.pharmacy?.name || 'Unknown'}</Table.Td>
                  <Table.Td>
                    {new Date(report.reportDate).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>{report.patientsServed}</Table.Td>
                  <Table.Td>{report.pharmacy?.ward || 'Unknown'}</Table.Td>
                  <Table.Td>{report.pharmacy?.lga || 'Unknown'}</Table.Td>
                  <Table.Td>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        setViewModalOpen(true);
                        setSelectedReport(report);
                      }}
                    >
                      View Details
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6} style={{ textAlign: 'center' }}>
                  {loading ? 'Loading...' : 'No reports found'}
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

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
              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Pharmacy Information
                </Text>
                <Text>
                  <strong>Pharmacy:</strong>{' '}
                  {selectedReport.pharmacy?.name || 'Unknown'}
                </Text>
                <Text>
                  <strong>Ward:</strong>{' '}
                  {selectedReport.pharmacy?.ward || 'Unknown'}
                </Text>
                <Text>
                  <strong>LGA:</strong>{' '}
                  {selectedReport.pharmacy?.lga || 'Unknown'}
                </Text>
              </Paper>

              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Report Overview
                </Text>
                <Text>
                  <strong>Report Date:</strong>{' '}
                  {new Date(selectedReport.reportDate).toLocaleDateString()}
                </Text>
                <Text>
                  <strong>Patients Served:</strong>{' '}
                  {selectedReport.patientsServed}
                </Text>
              </Paper>

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
                <Text mb="md">
                  {selectedReport.topMedications?.join(', ') || 'None reported'}
                </Text>

                <Text fw={500}>Common Ailments:</Text>
                <Text mb="md">
                  {selectedReport.commonAilments?.join(', ') || 'None reported'}
                </Text>
              </Paper>

              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Adverse Reactions
                </Text>
                <Text>
                  <strong>Total Reactions:</strong>{' '}
                  {selectedReport.adverseDrugReactions}
                </Text>
                <Text>
                  <strong>Details:</strong>{' '}
                  {selectedReport.adverseReactionDetails || 'None'}
                </Text>
              </Paper>

              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Public Health Activities
                </Text>
                <Group>
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
                <Group>
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
