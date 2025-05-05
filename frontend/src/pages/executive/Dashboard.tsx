import { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  SimpleGrid,
  Text,
  Card,
  Alert,
  LoadingOverlay,
  Group,
  Select,
} from '@mantine/core';
import { pharmacyService } from '../../services/pharmacyService';
import { reportService, ReportSummary } from '../../services/reportService';
import { DashboardCharts } from '../../components/charts/DashboardCharts';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pharmacyCount, setPharmacyCount] = useState(0);
  const [reportSummary, setReportSummary] = useState<ReportSummary>({
    totalReports: 0,
    totalPharmacies: 0,
    totalPatientsServed: 0,
    totalReferrals: 0,
    totalAdverseReactions: 0,
  });
  const [timeRange, setTimeRange] = useState('6months');

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch pharmacy count
        const pharmacies = await pharmacyService.getAllPharmacies();
        setPharmacyCount(pharmacies.length);

        // Fetch report summary
        const summary = await reportService.getReportsSummary();
        setReportSummary(summary);
      } catch (error: any) {
        setError(
          error.response?.data?.message || 'Failed to load dashboard data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate compliance rate
  const complianceRate =
    reportSummary.totalPharmacies > 0
      ? Math.round(
          (reportSummary.totalReports / (reportSummary.totalPharmacies * 6)) *
            100
        )
      : 0;

  return (
    <div>
      <Title order={2} mb="lg">
        Executive Dashboard
      </Title>

      {error && (
        <Alert color="red" mb="xl" withCloseButton onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          <Card withBorder p="xl" radius="md">
            <Text fz="lg" fw={500} c="dimmed">
              Total Pharmacies
            </Text>
            <Title order={3} mt="md">
              {pharmacyCount}
            </Title>
          </Card>

          <Card withBorder p="xl" radius="md">
            <Text fz="lg" fw={500} c="dimmed">
              Reports Submitted
            </Text>
            <Title order={3} mt="md">
              {reportSummary.totalReports}
            </Title>
          </Card>

          <Card withBorder p="xl" radius="md">
            <Text fz="lg" fw={500} c="dimmed">
              Compliance Rate
            </Text>
            <Title order={3} mt="md">
              {complianceRate}%
            </Title>
          </Card>

          <Card withBorder p="xl" radius="md">
            <Text fz="lg" fw={500} c="dimmed">
              Patients Served
            </Text>
            <Title order={3} mt="md">
              {reportSummary.totalPatientsServed.toLocaleString()}
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

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mt="xl">
          <Paper withBorder p="md">
            <Title order={3} mb="md">
              Key Metrics
            </Title>
            <SimpleGrid cols={2} spacing="md">
              <div>
                <Text fw={500}>Total Referrals</Text>
                <Text size="xl">{reportSummary.totalReferrals}</Text>
              </div>
              <div>
                <Text fw={500}>Adverse Reactions</Text>
                <Text size="xl">{reportSummary.totalAdverseReactions}</Text>
              </div>
            </SimpleGrid>
          </Paper>

          <Paper withBorder p="md">
            <Title order={3} mb="md">
              Compliance Overview
            </Title>
            <Text>
              {complianceRate >= 80 ? (
                <span style={{ color: 'green' }}>
                  Excellent compliance rate. Most pharmacies are submitting
                  reports regularly.
                </span>
              ) : complianceRate >= 50 ? (
                <span style={{ color: 'orange' }}>
                  Moderate compliance rate. Some pharmacies may need follow-up.
                </span>
              ) : (
                <span style={{ color: 'red' }}>
                  Low compliance rate. Immediate action needed to improve
                  reporting.
                </span>
              )}
            </Text>
          </Paper>
        </SimpleGrid>
      </div>
    </div>
  );
}
