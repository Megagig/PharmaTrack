import { useState, useEffect } from 'react';
import {
  Paper,
  Title,
  Text,
  Group,
  Select,
  LoadingOverlay,
  SimpleGrid,
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
  LineChart,
  Line,
} from 'recharts';
import { reportService, Report } from '../../services/reportService';

// Chart colors
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

interface DashboardChartsProps {
  pharmacyId?: string; // Optional - if provided, shows data for a specific pharmacy
}

export function DashboardCharts({ pharmacyId }: DashboardChartsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        let data: Report[];

        // Calculate date range based on selected time range
        const endDate = new Date();
        const startDate = new Date();

        if (timeRange === '1month') {
          startDate.setMonth(endDate.getMonth() - 1);
        } else if (timeRange === '3months') {
          startDate.setMonth(endDate.getMonth() - 3);
        } else if (timeRange === '6months') {
          startDate.setMonth(endDate.getMonth() - 6);
        } else if (timeRange === '1year') {
          startDate.setFullYear(endDate.getFullYear() - 1);
        }

        if (pharmacyId) {
          // Get reports for a specific pharmacy
          data = await reportService.getReportsByPharmacy(pharmacyId);
        } else {
          // Get all reports (for executives)
          data = await reportService.getReportsByDateRange(startDate, endDate);
        }

        setReports(data);
        console.log('Fetched reports for charts:', data); // <-- Add this log
      } catch (error: unknown) {
        let message = 'Failed to load reports';
        if (
          error &&
          typeof error === 'object' &&
          'response' in error &&
          error.response &&
          typeof error.response === 'object' &&
          'data' in error.response &&
          error.response.data &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data &&
          typeof error.response.data.message === 'string'
        ) {
          // Safely access Axios-like error structure
          message = error.response.data.message;
        } else if (error instanceof Error) {
          message = error.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [pharmacyId, timeRange]);

  // Prepare data for patient demographics chart
  const prepareDemographicsData = () => {
    if (reports.length === 0) return [];

    // Calculate totals
    const totalMale = reports.reduce(
      (sum, report) => sum + (report.maleCount || 0),
      0
    );
    const totalFemale = reports.reduce(
      (sum, report) => sum + (report.femaleCount || 0),
      0
    );
    const totalChildren = reports.reduce(
      (sum, report) => sum + (report.childrenCount || 0),
      0
    );
    const totalAdult = reports.reduce(
      (sum, report) => sum + (report.adultCount || 0),
      0
    );
    const totalElderly = reports.reduce(
      (sum, report) => sum + (report.elderlyCount || 0),
      0
    );

    return [
      { name: 'Male', value: totalMale },
      { name: 'Female', value: totalFemale },
      { name: 'Children', value: totalChildren },
      { name: 'Adult', value: totalAdult },
      { name: 'Elderly', value: totalElderly },
    ];
  };

  // Prepare data for patients served over time chart
  const preparePatientsTimeData = () => {
    if (reports.length === 0) return [];

    // Sort reports by date
    const sortedReports = [...reports].sort(
      (a, b) =>
        new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime()
    );

    return sortedReports.map((report) => ({
      date: new Date(report.reportDate).toLocaleDateString(),
      patients: report.patientsServed,
    }));
  };

  // Prepare data for top medications chart
  const prepareTopMedicationsData = () => {
    if (reports.length === 0) return [];

    // Count occurrences of each medication
    const medicationCounts: Record<string, number> = {};

    reports.forEach((report) => {
      report.topMedications.forEach((med) => {
        medicationCounts[med] = (medicationCounts[med] || 0) + 1;
      });
    });

    // Convert to array and sort by count
    const medicationsArray = Object.entries(medicationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Get top 5

    return medicationsArray;
  };

  // Prepare data for common ailments chart
  const prepareAilmentsData = () => {
    if (reports.length === 0) return [];

    // Count occurrences of each ailment
    const ailmentCounts: Record<string, number> = {};

    reports.forEach((report) => {
      report.commonAilments.forEach((ailment) => {
        ailmentCounts[ailment] = (ailmentCounts[ailment] || 0) + 1;
      });
    });

    // Convert to array and sort by count
    const ailmentsArray = Object.entries(ailmentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Get top 5

    return ailmentsArray;
  };

  // Prepare data for service delivery chart
  const prepareServiceDeliveryData = () => {
    if (reports.length === 0) return [];

    // Calculate totals
    const totalPrescriptions = reports.reduce(
      (sum, report) => sum + (report.prescriptionsFilled || 0),
      0
    );
    const totalOTC = reports.reduce(
      (sum, report) => sum + (report.otcConsultations || 0),
      0
    );
    const totalMTM = reports.reduce(
      (sum, report) => sum + (report.mtmInterventions || 0),
      0
    );

    return [
      { name: 'Prescriptions', value: totalPrescriptions },
      { name: 'OTC Consultations', value: totalOTC },
      { name: 'MTM Interventions', value: totalMTM },
    ];
  };

  // Prepare data for technology adoption chart
  const prepareTechnologyAdoptionData = () => {
    if (reports.length === 0) return [];

    const totalReports = reports.length;
    const electronicRecords = reports.filter(
      (r) => r.usesElectronicRecords
    ).length;
    const mobileHealth = reports.filter((r) => r.usesMobileHealth).length;
    const inventoryManagement = reports.filter(
      (r) => r.usesInventoryManagement
    ).length;

    return [
      {
        name: 'Electronic Records',
        value:
          totalReports > 0
            ? Math.round((electronicRecords / totalReports) * 100)
            : 0,
      },
      {
        name: 'Mobile Health',
        value:
          totalReports > 0
            ? Math.round((mobileHealth / totalReports) * 100)
            : 0,
      },
      {
        name: 'Inventory Management',
        value:
          totalReports > 0
            ? Math.round((inventoryManagement / totalReports) * 100)
            : 0,
      },
    ];
  };

  // Prepare data for economic impact chart
  const prepareEconomicImpactData = () => {
    if (reports.length === 0) return [];

    // We're using a simplified calculation for now
    // Will implement more detailed metrics in future versions
    const staffCount = reports.reduce(
      (sum, report) =>
        sum +
        (report.staffOthers || 0),
      0
    );

    // Group by month
    const monthlyData: Record<
      string,
      { revenue: number; taxes: number; staff: number; count: number }
    > = {};

    reports.forEach((report) => {
      const month = new Date(report.reportDate).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });

      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, taxes: 0, staff: 0, count: 0 };
      }

      monthlyData[month].revenue += report.monthlyRevenue || 0;
      monthlyData[month].taxes += report.taxesPaid || 0;
      monthlyData[month].staff +=
        (report.staffPharmacists || 0) +
        (report.staffTechnicians || 0) +
        (report.staffOthers || 0);
      monthlyData[month].count += 1;
    });

    // Convert to array and calculate averages
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        avgRevenue: data.count > 0 ? Math.round(data.revenue / data.count) : 0,
        avgTaxes: data.count > 0 ? Math.round(data.taxes / data.count) : 0,
        avgStaff: data.count > 0 ? Math.round(data.staff / data.count) : 0,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });
  };

  const demographicsData = prepareDemographicsData();
  const patientsTimeData = preparePatientsTimeData();
  const topMedicationsData = prepareTopMedicationsData();
  const ailmentsData = prepareAilmentsData();
  const serviceDeliveryData = prepareServiceDeliveryData();
  const technologyAdoptionData = prepareTechnologyAdoptionData();
  const economicImpactData = prepareEconomicImpactData();

  return (
    <div>
      <Group justify="space-between" mb="md">
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

      {error && <Text color="red">{error}</Text>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Patients Served Over Time */}
        <Paper withBorder p="md" style={{ position: 'relative', height: 300 }}>
          <LoadingOverlay visible={loading} />
          <Text fw={700} size="lg" mb="md">
            Patients Served Over Time
          </Text>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={patientsTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="patients"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {/* Patient Demographics Chart */}
          <Paper
            withBorder
            p="md"
            style={{ position: 'relative', height: 300 }}
          >
            <LoadingOverlay visible={loading} />
            <Text fw={700} size="lg" mb="md">
              Patient Demographics
            </Text>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={demographicsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {demographicsData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>

          {/* Top Medications */}
          <Paper
            withBorder
            p="md"
            style={{ position: 'relative', height: 300 }}
          >
            <LoadingOverlay visible={loading} />
            <Text fw={700} size="lg" mb="md">
              Top Medications
            </Text>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topMedicationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          {/* Common Ailments */}
          <Paper
            withBorder
            p="md"
            style={{ position: 'relative', height: 300 }}
          >
            <LoadingOverlay visible={loading} />
            <Text fw={700} size="lg" mb="md">
              Common Ailments
            </Text>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ailmentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          {/* Service Delivery Chart */}
          <Paper
            withBorder
            p="md"
            style={{ position: 'relative', height: 300 }}
          >
            <LoadingOverlay visible={loading} />
            <Text fw={700} size="lg" mb="md">
              Service Delivery
            </Text>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={serviceDeliveryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceDeliveryData.map((_, index) => (
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
          </Paper>

          {/* Technology Adoption Chart */}
          <Paper
            withBorder
            p="md"
            style={{ position: 'relative', height: 300 }}
          >
            <LoadingOverlay visible={loading} />
            <Text fw={700} size="lg" mb="md">
              Technology Adoption (%)
            </Text>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={technologyAdoptionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="value" fill="#FF8042" name="Adoption Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          {/* Economic Impact Chart */}
          <Paper
            withBorder
            p="md"
            style={{ position: 'relative', height: 300 }}
          >
            <LoadingOverlay visible={loading} />
            <Text fw={700} size="lg" mb="md">
              Economic Impact
            </Text>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={economicImpactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="avgRevenue"
                  fill="#8884d8"
                  name="Avg. Revenue (₦)"
                />
                <Bar dataKey="avgTaxes" fill="#82ca9d" name="Avg. Taxes (₦)" />
                <Bar
                  dataKey="avgStaff"
                  fill="#ffc658"
                  name="Avg. Staff Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </SimpleGrid>
      </div>
    </div>
  );
}
