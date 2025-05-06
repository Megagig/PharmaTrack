import { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  SimpleGrid,
  Text,
  Select,
  Group,
  LoadingOverlay,
  Alert,
  Button,
  Menu,
  rem,
} from '@mantine/core';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { reportService, Report } from '../../services/reportService';
import { pharmacyService } from '../../services/pharmacyService';

// Chart colors
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

export function MedicationsTrends() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [lgaFilter, setLgaFilter] = useState<string | null>('All LGAs');
  const [wardFilter, setWardFilter] = useState<string | null>('All Wards');
  const [timeFilter, setTimeFilter] = useState<string | null>('Last 6 Months');
  const [lgas, setLgas] = useState<string[]>(['All LGAs']);
  const [wards, setWards] = useState<string[]>(['All Wards']);

  // Fetch reports and location data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Calculate date range based on time filter
        const endDate = new Date();
        const startDate = new Date();

        if (timeFilter === 'Last Month') {
          startDate.setMonth(endDate.getMonth() - 1);
        } else if (timeFilter === 'Last 3 Months') {
          startDate.setMonth(endDate.getMonth() - 3);
        } else if (timeFilter === 'Last 6 Months') {
          startDate.setMonth(endDate.getMonth() - 6);
        } else if (timeFilter === 'Last Year') {
          startDate.setFullYear(endDate.getFullYear() - 1);
        }

        // Fetch reports
        const reportsData = await reportService.getReportsByDateRange(
          startDate,
          endDate
        );
        setReports(reportsData);
        setFilteredReports(reportsData);

        // Fetch pharmacies to get unique LGAs and wards
        const pharmacies = await pharmacyService.getAllPharmacies();

        // Extract unique LGAs
        const uniqueLgas = new Set<string>();
        pharmacies.forEach((pharmacy) => uniqueLgas.add(pharmacy.lga));
        setLgas(['All LGAs', ...Array.from(uniqueLgas)]);

        // Extract unique wards
        const uniqueWards = new Set<string>();
        pharmacies.forEach((pharmacy) => uniqueWards.add(pharmacy.ward));
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
  }, [timeFilter]);

  // Filter reports based on LGA and ward
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

    setFilteredReports(filtered);
  }, [reports, lgaFilter, wardFilter]);

  // Prepare data for top medications chart
  const prepareTopMedicationsData = () => {
    if (filteredReports.length === 0) return [];

    // Count occurrences of each medication
    const medicationCounts: Record<string, number> = {};

    filteredReports.forEach((report) => {
      report.topMedications.forEach((med) => {
        medicationCounts[med] = (medicationCounts[med] || 0) + 1;
      });
    });

    // Convert to array and sort by count
    const medicationsArray = Object.entries(medicationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Get top 10

    return medicationsArray;
  };

  // Prepare data for common ailments chart
  const prepareAilmentsData = () => {
    if (filteredReports.length === 0) return [];

    // Count occurrences of each ailment
    const ailmentCounts: Record<string, number> = {};

    filteredReports.forEach((report) => {
      report.commonAilments.forEach((ailment) => {
        ailmentCounts[ailment] = (ailmentCounts[ailment] || 0) + 1;
      });
    });

    // Convert to array and sort by count
    const ailmentsArray = Object.entries(ailmentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Get top 10

    return ailmentsArray;
  };

  // Prepare data for adverse reactions chart
  const prepareAdverseReactionsData = () => {
    if (filteredReports.length === 0) return [];

    // Group reports by month
    const monthlyData: Record<string, number> = {};

    filteredReports.forEach((report) => {
      const date = new Date(report.reportDate);
      const monthYear = `${date.toLocaleString('default', {
        month: 'short',
      })} ${date.getFullYear()}`;

      monthlyData[monthYear] =
        (monthlyData[monthYear] || 0) + report.adverseDrugReactions;
    });

    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        const [monthA, yearA] = a.month.split(' ');
        const [monthB, yearB] = b.month.split(' ');

        if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);

        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        return months.indexOf(monthA) - months.indexOf(monthB);
      });
  };

  // Prepare data for age group chart
  const prepareAgeGroupData = () => {
    if (filteredReports.length === 0) return [];

    // Sum patients by age group
    const totalChildren = filteredReports.reduce(
      (sum, report) => sum + (report.childrenCount || 0),
      0
    );
    const totalAdults = filteredReports.reduce(
      (sum, report) => sum + (report.adultCount || 0),
      0
    );
    const totalElderly = filteredReports.reduce(
      (sum, report) => sum + (report.elderlyCount || 0),
      0
    );

    return [
      { name: 'Children (0-12)', value: totalChildren },
      { name: 'Adults (13-59)', value: totalAdults },
      { name: 'Elderly (60+)', value: totalElderly },
    ];
  };

  // Function to download the exported file
  const handleExport = async (format: 'detailed' | 'summary') => {
    try {
      setLoading(true);

      // Calculate date range based on time filter
      const endDate = new Date();
      const startDate = new Date();

      if (timeFilter === 'Last Month') {
        startDate.setMonth(endDate.getMonth() - 1);
      } else if (timeFilter === 'Last 3 Months') {
        startDate.setMonth(endDate.getMonth() - 3);
      } else if (timeFilter === 'Last 6 Months') {
        startDate.setMonth(endDate.getMonth() - 6);
      } else if (timeFilter === 'Last Year') {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }

      const blob = await reportService.exportReports(
        startDate,
        endDate,
        format
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medications-trends-${format}-${
        new Date().toISOString().split('T')[0]
      }.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to export data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const topMedicationsData = prepareTopMedicationsData();
  const ailmentsData = prepareAilmentsData();
  const adverseReactionsData = prepareAdverseReactionsData();
  const ageGroupData = prepareAgeGroupData();

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Medications & Ailments Trends</Title>
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <Button>
              <Group gap="xs">
                <span>Export Data</span>
                <span style={{ fontSize: rem(16), marginTop: '2px' }}>▼</span>
              </Group>
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Choose export format</Menu.Label>
            <Menu.Item onClick={() => handleExport('detailed')}>
              Detailed Report
            </Menu.Item>
            <Menu.Item onClick={() => handleExport('summary')}>
              Summary by LGA
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      {error && (
        <Alert color="red" mb="xl" withCloseButton onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Group gap="md" mb="xl">
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
          label="Time Period"
          placeholder="Select Period"
          data={['Last Month', 'Last 3 Months', 'Last 6 Months', 'Last Year']}
          value={timeFilter}
          onChange={setTimeFilter}
          style={{ flex: 1 }}
        />
      </Group>

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <Paper withBorder p="md" style={{ height: 400 }}>
            <Text fw={700} size="lg" mb="md">
              Top Medications
            </Text>
            {topMedicationsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topMedicationsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Frequency" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Text c="dimmed" ta="center" mt={50}>
                No data available
              </Text>
            )}
          </Paper>

          <Paper withBorder p="md" style={{ height: 400 }}>
            <Text fw={700} size="lg" mb="md">
              Common Ailments
            </Text>
            {ailmentsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ailmentsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="Frequency" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Text c="dimmed" ta="center" mt={50}>
                No data available
              </Text>
            )}
          </Paper>

          <Paper withBorder p="md" style={{ height: 400 }}>
            <Text fw={700} size="lg" mb="md">
              Adverse Drug Reactions
            </Text>
            {adverseReactionsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={adverseReactionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#FF8042" name="Reactions" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Text c="dimmed" ta="center" mt={50}>
                No data available
              </Text>
            )}
          </Paper>

          <Paper withBorder p="md" style={{ height: 400 }}>
            <Text fw={700} size="lg" mb="md">
              Patient Age Distribution
            </Text>
            {ageGroupData.length > 0 &&
            ageGroupData.some((item) => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ageGroupData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ageGroupData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Text c="dimmed" ta="center" mt={50}>
                No data available
              </Text>
            )}
          </Paper>
        </SimpleGrid>
      </div>
    </div>
  );
}
