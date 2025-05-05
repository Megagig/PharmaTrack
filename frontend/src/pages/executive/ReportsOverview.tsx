import { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  SimpleGrid,
  Text,
  Card,
  Select,
  Table,
  LoadingOverlay,
  Alert,
  Group,
  Button,
} from '@mantine/core';
import { pharmacyService } from '../../services/pharmacyService';
import { reportService, Report } from '../../services/reportService';
import { DashboardCharts } from '../../components/charts/DashboardCharts';

export function ReportsOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [lgaFilter, setLgaFilter] = useState<string | null>('All LGAs');
  const [monthFilter, setMonthFilter] = useState<string | null>('All Months');
  const [lgas, setLgas] = useState<string[]>(['All LGAs']);
  const [timeRange, setTimeRange] = useState('6months');

  // Fetch reports and LGAs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 6); // Default to last 6 months

        // Fetch reports
        const reportsData = await reportService.getReportsByDateRange(
          startDate,
          endDate
        );
        setReports(reportsData);
        setFilteredReports(reportsData);

        // Fetch pharmacies to get unique LGAs
        const pharmacies = await pharmacyService.getAllPharmacies();
        const uniqueLgas = new Set<string>();
        pharmacies.forEach((pharmacy) => uniqueLgas.add(pharmacy.lga));
        setLgas(['All LGAs', ...Array.from(uniqueLgas)]);
      } catch (error: any) {
        setError(
          error.response?.data?.message || 'Failed to load reports data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter reports based on LGA and month
  useEffect(() => {
    let filtered = [...reports];

    // Apply LGA filter
    if (lgaFilter && lgaFilter !== 'All LGAs') {
      filtered = filtered.filter(
        (report) => report.pharmacy?.lga === lgaFilter
      );
    }

    // Apply month filter
    if (monthFilter && monthFilter !== 'All Months') {
      const monthIndex = [
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
      ].indexOf(monthFilter);

      if (monthIndex !== -1) {
        filtered = filtered.filter((report) => {
          const reportDate = new Date(report.reportDate);
          return reportDate.getMonth() === monthIndex;
        });
      }
    }

    setFilteredReports(filtered);
  }, [reports, lgaFilter, monthFilter]);

  // Calculate metrics
  const totalReports = filteredReports.length;
  const totalPatientsServed = filteredReports.reduce(
    (sum, report) => sum + report.patientsServed,
    0
  );

  // Get unique pharmacies to calculate average
  const uniquePharmacies = new Set<string>();
  filteredReports.forEach((report) => {
    if (report.pharmacyId) {
      uniquePharmacies.add(report.pharmacyId);
    }
  });

  const avgReportsPerPharmacy =
    uniquePharmacies.size > 0
      ? (totalReports / uniquePharmacies.size).toFixed(1)
      : '0';

  // Get months for filter
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

  return (
    <div>
      <Title order={2} mb="lg">
        Reports Overview
      </Title>

      {error && (
        <Alert color="red" mb="xl" withCloseButton onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="xl">
        <Select
          label="Filter by LGA"
          placeholder="Select LGA"
          data={lgas}
          value={lgaFilter}
          onChange={setLgaFilter}
        />

        <Select
          label="Filter by Month"
          placeholder="Select Month"
          data={getMonths()}
          value={monthFilter}
          onChange={setMonthFilter}
        />
      </SimpleGrid>

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          <Card withBorder p="xl" radius="md">
            <Text fz="lg" fw={500} c="dimmed">
              Total Reports
            </Text>
            <Title order={3} mt="md">
              {totalReports}
            </Title>
          </Card>

          <Card withBorder p="xl" radius="md">
            <Text fz="lg" fw={500} c="dimmed">
              Patients Served
            </Text>
            <Title order={3} mt="md">
              {totalPatientsServed.toLocaleString()}
            </Title>
          </Card>

          <Card withBorder p="xl" radius="md">
            <Text fz="lg" fw={500} c="dimmed">
              Avg. Reports per Pharmacy
            </Text>
            <Title order={3} mt="md">
              {avgReportsPerPharmacy}
            </Title>
          </Card>
        </SimpleGrid>

        <Paper withBorder p="md" mt="xl">
          <Group position="apart" mb="md">
            <Title order={3}>Data Visualization</Title>
            <Select
              value={timeRange}
              onChange={(value) => setTimeRange(value || '6months')}
              data={[
                { value: '1month', label: 'Last Month' },
                { value: '3months', label: 'Last 3 Months' },
                { value: '6months', label: 'Last 6 Months' },
                { value: '1year', label: 'Last Year' },
              ]}
              style={{ width: 200 }}
            />
          </Group>

          <DashboardCharts />
        </Paper>

        <Paper withBorder p="md" mt="xl">
          <Title order={3} mb="md">
            Recent Reports
          </Title>

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Pharmacy</Table.Th>
                <Table.Th>LGA</Table.Th>
                <Table.Th>Patients</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredReports.length > 0 ? (
                filteredReports.slice(0, 10).map((report) => (
                  <Table.Tr key={report.id}>
                    <Table.Td>
                      {new Date(report.reportDate).toLocaleDateString()}
                    </Table.Td>
                    <Table.Td>{report.pharmacy?.name || 'Unknown'}</Table.Td>
                    <Table.Td>{report.pharmacy?.lga || 'Unknown'}</Table.Td>
                    <Table.Td>{report.patientsServed}</Table.Td>
                    <Table.Td>
                      <Button size="xs" variant="outline">
                        View Details
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                    {loading ? 'Loading...' : 'No reports found'}
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Paper>
      </div>
    </div>
  );
}
