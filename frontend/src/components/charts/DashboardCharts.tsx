import { useState, useEffect } from 'react';
import { Paper, Title, Text, Group, Select, LoadingOverlay } from '@mantine/core';
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
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to load reports');
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
    const totalMale = reports.reduce((sum, report) => sum + (report.maleCount || 0), 0);
    const totalFemale = reports.reduce((sum, report) => sum + (report.femaleCount || 0), 0);
    const totalChildren = reports.reduce((sum, report) => sum + (report.childrenCount || 0), 0);
    const totalAdult = reports.reduce((sum, report) => sum + (report.adultCount || 0), 0);
    const totalElderly = reports.reduce((sum, report) => sum + (report.elderlyCount || 0), 0);
    
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
    const sortedReports = [...reports].sort((a, b) => 
      new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime()
    );
    
    return sortedReports.map(report => ({
      date: new Date(report.reportDate).toLocaleDateString(),
      patients: report.patientsServed
    }));
  };
  
  // Prepare data for top medications chart
  const prepareTopMedicationsData = () => {
    if (reports.length === 0) return [];
    
    // Count occurrences of each medication
    const medicationCounts: Record<string, number> = {};
    
    reports.forEach(report => {
      report.topMedications.forEach(med => {
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
    
    reports.forEach(report => {
      report.commonAilments.forEach(ailment => {
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
  
  const demographicsData = prepareDemographicsData();
  const patientsTimeData = preparePatientsTimeData();
  const topMedicationsData = prepareTopMedicationsData();
  const ailmentsData = prepareAilmentsData();
  
  return (
    <div>
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
      
      {error && <Text color="red">{error}</Text>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Patients Served Over Time */}
        <Paper withBorder p="md" style={{ position: 'relative', height: 300 }}>
          <LoadingOverlay visible={loading} />
          <Title order={4} mb="md">Patients Served Over Time</Title>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={patientsTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="patients" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
        
        {/* Patient Demographics */}
        <Paper withBorder p="md" style={{ position: 'relative', height: 300 }}>
          <LoadingOverlay visible={loading} />
          <Title order={4} mb="md">Patient Demographics</Title>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={demographicsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {demographicsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
        
        {/* Top Medications */}
        <Paper withBorder p="md" style={{ position: 'relative', height: 300 }}>
          <LoadingOverlay visible={loading} />
          <Title order={4} mb="md">Top Medications</Title>
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
        <Paper withBorder p="md" style={{ position: 'relative', height: 300 }}>
          <LoadingOverlay visible={loading} />
          <Title order={4} mb="md">Common Ailments</Title>
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
      </div>
    </div>
  );
}
