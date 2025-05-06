import { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  SimpleGrid,
  Text,
  Card,
  Table,
  Group,
  Select,
  LoadingOverlay,
  Alert,
  Badge,
  Modal,
  Box,
} from '@mantine/core';
import { pharmacyService, Pharmacy } from '../../services/pharmacyService';
import { reportService, Report } from '../../services/reportService';

interface PharmacyWithCompliance extends Pharmacy {
  lastReport: string;
  isCompliant: boolean;
}

export function ComplianceMonitoring() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pharmacies, setPharmacies] = useState<PharmacyWithCompliance[]>([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState<
    PharmacyWithCompliance[]
  >([]);
  const [lgaFilter, setLgaFilter] = useState<string | null>('All LGAs');
  const [wardFilter, setWardFilter] = useState<string | null>('All Wards');
  const [lgas, setLgas] = useState<string[]>(['All LGAs']);
  const [wards, setWards] = useState<string[]>(['All Wards']);
  const [complianceStats, setComplianceStats] = useState({
    overallCompliance: 0,
    nonCompliantCount: 0,
    neverSubmittedCount: 0,
  });
  const [viewPharmacyModalOpen, setViewPharmacyModalOpen] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] =
    useState<PharmacyWithCompliance | null>(null);

  // Fetch pharmacies and reports
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all pharmacies
        const pharmaciesData = await pharmacyService.getAllPharmacies();

        // Fetch all reports
        const reportsData = await reportService.getAllReports();

        // Calculate last report date for each pharmacy
        const pharmaciesWithCompliance: PharmacyWithCompliance[] =
          pharmaciesData.map((pharmacy) => {
            // Find reports for this pharmacy
            const pharmacyReports = reportsData.filter(
              (report) => report.pharmacyId === pharmacy.id
            );

            // Sort by date (newest first)
            const sortedReports = [...pharmacyReports].sort(
              (a, b) =>
                new Date(b.reportDate).getTime() -
                new Date(a.reportDate).getTime()
            );

            // Get last report date
            const lastReportDate =
              sortedReports.length > 0
                ? new Date(sortedReports[0].reportDate)
                : null;

            // Check if pharmacy is compliant (has submitted a report in the last 30 days)
            const today = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);

            const isCompliant =
              lastReportDate && lastReportDate > thirtyDaysAgo;

            return {
              ...pharmacy,
              lastReport: lastReportDate
                ? lastReportDate.toLocaleDateString()
                : 'Never',
              isCompliant,
            };
          });

        setPharmacies(pharmaciesWithCompliance);
        setFilteredPharmacies(pharmaciesWithCompliance);

        // Extract unique LGAs
        const uniqueLgas = new Set<string>();
        pharmaciesData.forEach((pharmacy) => uniqueLgas.add(pharmacy.lga));
        setLgas(['All LGAs', ...Array.from(uniqueLgas)]);

        // Extract unique wards
        const uniqueWards = new Set<string>();
        pharmaciesData.forEach((pharmacy) => uniqueWards.add(pharmacy.ward));
        setWards(['All Wards', ...Array.from(uniqueWards)]);

        // Calculate compliance statistics
        const compliantCount = pharmaciesWithCompliance.filter(
          (p) => p.isCompliant
        ).length;
        const neverSubmittedCount = pharmaciesWithCompliance.filter(
          (p) => p.lastReport === 'Never'
        ).length;
        const overallCompliance =
          pharmaciesWithCompliance.length > 0
            ? Math.round(
                (compliantCount / pharmaciesWithCompliance.length) * 100
              )
            : 0;

        setComplianceStats({
          overallCompliance,
          nonCompliantCount: pharmaciesWithCompliance.length - compliantCount,
          neverSubmittedCount,
        });
      } catch (error: any) {
        setError(
          error.response?.data?.message || 'Failed to load compliance data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter pharmacies based on LGA and ward
  useEffect(() => {
    let filtered = [...pharmacies];

    // Apply LGA filter
    if (lgaFilter && lgaFilter !== 'All LGAs') {
      filtered = filtered.filter((pharmacy) => pharmacy.lga === lgaFilter);
    }

    // Apply ward filter
    if (wardFilter && wardFilter !== 'All Wards') {
      filtered = filtered.filter((pharmacy) => pharmacy.ward === wardFilter);
    }

    // Only show non-compliant pharmacies
    filtered = filtered.filter((pharmacy) => !pharmacy.isCompliant);

    setFilteredPharmacies(filtered);
  }, [pharmacies, lgaFilter, wardFilter]);

  return (
    <div>
      <Title order={2} mb="lg">
        Compliance Monitoring
      </Title>

      {error && (
        <Alert color="red" mb="xl" withCloseButton onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" mb="xl">
          <Card withBorder p="xl" radius="md">
            <Text fz="lg" fw={500} c="dimmed">
              Overall Compliance
            </Text>
            <Title
              order={3}
              mt="md"
              style={{
                color:
                  complianceStats.overallCompliance > 70
                    ? 'green'
                    : complianceStats.overallCompliance > 50
                    ? 'orange'
                    : 'red',
              }}
            >
              {complianceStats.overallCompliance}%
            </Title>
          </Card>

          <Card withBorder p="xl" radius="md">
            <Text fz="lg" fw={500} c="dimmed">
              Non-Compliant Pharmacies
            </Text>
            <Title order={3} mt="md">
              {complianceStats.nonCompliantCount}
            </Title>
          </Card>

          <Card withBorder p="xl" radius="md">
            <Text fz="lg" fw={500} c="dimmed">
              Never Submitted
            </Text>
            <Title order={3} mt="md">
              {complianceStats.neverSubmittedCount}
            </Title>
          </Card>
        </SimpleGrid>

        <Group mb="md">
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
        </Group>

        <Paper withBorder p="md">
          <Title order={3} mb="md">
            Non-Compliant Pharmacies
          </Title>

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Pharmacy Name</Table.Th>
                <Table.Th>Last Report</Table.Th>
                <Table.Th>Ward</Table.Th>
                <Table.Th>LGA</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredPharmacies.length > 0 ? (
                filteredPharmacies.map((pharmacy) => (
                  <Table.Tr key={pharmacy.id}>
                    <Table.Td>{pharmacy.name}</Table.Td>
                    <Table.Td>{pharmacy.lastReport}</Table.Td>
                    <Table.Td>{pharmacy.ward}</Table.Td>
                    <Table.Td>{pharmacy.lga}</Table.Td>
                    <Table.Td>
                      {pharmacy.lastReport === 'Never' ? (
                        <Badge color="red">Never Submitted</Badge>
                      ) : (
                        <Badge color="orange">Overdue</Badge>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                    {loading
                      ? 'Loading...'
                      : 'No non-compliant pharmacies found'}
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </div>

      <Modal
        opened={viewPharmacyModalOpen}
        onClose={() => {
          setViewPharmacyModalOpen(false);
          setSelectedPharmacy(null);
        }}
        size="lg"
      >
        <Box>
          <Title order={2} mb="md">
            Pharmacy Compliance Details
          </Title>
          {selectedPharmacy && (
            <div>
              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Pharmacy Information
                </Text>
                <Text>
                  <strong>Name:</strong> {selectedPharmacy.name}
                </Text>
                <Text>
                  <strong>PCN License:</strong>{' '}
                  {selectedPharmacy.pcnLicenseNumber}
                </Text>
                <Text>
                  <strong>Address:</strong> {selectedPharmacy.address}
                </Text>
                <Text>
                  <strong>Ward:</strong> {selectedPharmacy.ward}
                </Text>
                <Text>
                  <strong>LGA:</strong> {selectedPharmacy.lga}
                </Text>
              </Paper>

              <Paper withBorder p="md" mb="md">
                <Text fw={700} size="lg" mb="md">
                  Compliance Status
                </Text>
                <Text>
                  <strong>Last Report:</strong> {selectedPharmacy.lastReport}
                </Text>
                <Text>
                  <strong>Reports Submitted:</strong>{' '}
                  {selectedPharmacy.reportsSubmitted}
                </Text>
                <Text>
                  <strong>Compliance Score:</strong>{' '}
                  {selectedPharmacy.complianceScore}%
                </Text>
              </Paper>

              <Paper withBorder p="md">
                <Text fw={700} size="lg" mb="md">
                  Contact Information
                </Text>
                <Text>
                  <strong>Pharmacist in Charge:</strong>{' '}
                  {selectedPharmacy.pharmacistInCharge}
                </Text>
                <Text>
                  <strong>Phone:</strong> {selectedPharmacy.phoneNumber}
                </Text>
                <Text>
                  <strong>Email:</strong> {selectedPharmacy.email || 'N/A'}
                </Text>
              </Paper>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
