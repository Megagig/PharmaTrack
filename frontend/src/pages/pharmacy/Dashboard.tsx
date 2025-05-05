import { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  SimpleGrid,
  Text,
  Card,
  Alert,
  Button,
  Group,
  LoadingOverlay,
} from '@mantine/core';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { pharmacyService, Pharmacy } from '../../services/pharmacyService';
import { reportService, Report } from '../../services/reportService';
import { DashboardCharts } from '../../components/charts/DashboardCharts';

export function Dashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [dashboardData, setDashboardData] = useState({
    reportsSubmitted: 0,
    lastReportDate: '',
    patientsServed: 0,
  });

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Fetch pharmacy data and reports
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.pharmacyId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch pharmacy data
        const pharmacyData = await pharmacyService.getPharmacyById(
          user.pharmacyId
        );
        setPharmacy(pharmacyData);

        // Fetch reports for this pharmacy
        const reportsData = await reportService.getReportsByPharmacy(
          user.pharmacyId
        );
        setReports(reportsData);

        // Calculate dashboard metrics
        if (reportsData.length > 0) {
          // Sort reports by date (newest first)
          const sortedReports = [...reportsData].sort(
            (a, b) =>
              new Date(b.reportDate).getTime() -
              new Date(a.reportDate).getTime()
          );

          // Get latest report date
          const latestReport = sortedReports[0];
          const latestReportDate = new Date(
            latestReport.reportDate
          ).toLocaleDateString();

          // Calculate total patients served
          const totalPatientsServed = reportsData.reduce(
            (sum, report) => sum + report.patientsServed,
            0
          );

          setDashboardData({
            reportsSubmitted: reportsData.length,
            lastReportDate: latestReportDate,
            patientsServed: totalPatientsServed,
          });
        }
      } catch (error: any) {
        setError(
          error.response?.data?.message || 'Failed to load dashboard data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.pharmacyId]);

  return (
    <div>
      <Title order={2} mb="lg">
        Pharmacy Dashboard
      </Title>

      {error && (
        <Alert color="red" mb="xl" withCloseButton onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Alert color="blue" mb="xl">
        <Group justify="space-between">
          <div>
            <Text fw={500}>Monthly Report Reminder</Text>
            <Text size="sm">
              Don't forget to submit your report for {currentMonth}{' '}
              {currentYear}.
            </Text>
          </div>
          <Button component={Link} to="/pharmacy/submit-report">
            Submit Now
          </Button>
        </Group>
      </Alert>

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          <Card withBorder p="xl" radius="md">
            <Text fz="lg" fw={500} c="dimmed">
              Total Reports Submitted
            </Text>
            <Title order={3} mt="md">
              {dashboardData.reportsSubmitted}
            </Title>
          </Card>

          <Card withBorder p="xl" radius="md">
            <Text fz="lg" fw={500} c="dimmed">
              Last Report Date
            </Text>
            <Title order={3} mt="md">
              {dashboardData.lastReportDate || 'No reports yet'}
            </Title>
          </Card>

          <Card withBorder p="xl" radius="md">
            <Text fz="lg" fw={500} c="dimmed">
              Total Patients Served
            </Text>
            <Title order={3} mt="md">
              {dashboardData.patientsServed}
            </Title>
          </Card>
        </SimpleGrid>

        <Paper withBorder p="md" mt="xl" pos="relative">
          <Title order={3} mb="md">
            Pharmacy Information
          </Title>
          {pharmacy ? (
            <>
              <Text>
                <strong>Name:</strong> {pharmacy.name}
              </Text>
              <Text>
                <strong>Address:</strong> {pharmacy.address}
              </Text>
              <Text>
                <strong>Pharmacist in Charge:</strong>{' '}
                {pharmacy.pharmacistInCharge}
              </Text>
              <Text>
                <strong>License Number:</strong> {pharmacy.pcnLicenseNumber}
              </Text>
              <Text>
                <strong>Ward/LGA:</strong> {pharmacy.ward} / {pharmacy.lga}
              </Text>
            </>
          ) : (
            !loading && (
              <Text c="dimmed">No pharmacy information available</Text>
            )
          )}
        </Paper>

        {/* Data Visualization */}
        <Paper withBorder p="md" mt="xl">
          {user?.pharmacyId && <DashboardCharts pharmacyId={user.pharmacyId} />}
        </Paper>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mt="xl">
          <Paper withBorder p="md">
            <Title order={3} mb="md">
              Recent Reports
            </Title>
            {reports.length > 0 ? (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {reports.slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    style={{
                      marginBottom: '10px',
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <Text fw={500}>
                      Report from{' '}
                      {new Date(report.reportDate).toLocaleDateString()}
                    </Text>
                    <Text size="sm">Patients: {report.patientsServed}</Text>
                  </div>
                ))}
              </div>
            ) : (
              !loading && <Text c="dimmed">No reports submitted yet</Text>
            )}
          </Paper>

          <Paper withBorder p="md">
            <Title order={3} mb="md">
              Quick Actions
            </Title>
            <Group>
              <Button component={Link} to="/pharmacy/submit-report">
                Submit Report
              </Button>
              <Button
                component={Link}
                to="/pharmacy/my-reports"
                variant="outline"
              >
                View Reports
              </Button>
              <Button component={Link} to="/pharmacy/profile" variant="outline">
                Update Profile
              </Button>
            </Group>
          </Paper>
        </SimpleGrid>
      </div>
    </div>
  );
}
