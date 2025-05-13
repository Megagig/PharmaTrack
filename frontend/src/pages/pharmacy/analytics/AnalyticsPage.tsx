import { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  Button,
  Group,
  Select,
  Stack,
  Text,
  Box,
  Alert,
  Loader,
  Grid,
  Card,
  Container,
  Divider,
  SimpleGrid,
  RingProgress,
  List,
  ThemeIcon,
  Progress,
  Tabs,
  Table,
  SegmentedControl,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useAuthStore } from '../../../store/authStore';
import { notifications } from '@mantine/notifications';
import {
  IconDownload,
  IconChartBar,
  IconChartPie,
  IconCoin,
  IconArrowUp,
  IconArrowDown,
  IconCheck,
  IconCurrencyNaira,
  IconPill,
  IconUsers,
  IconShoppingCart,
  IconTruckDelivery,
  IconReportAnalytics,
  IconCalendar,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import {
  addDays,
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';

// Define types
interface AnalyticsSummary {
  salesTrend: { period: string; value: number }[];
  topSellingProducts: { name: string; quantity: number; revenue: number }[];
  categoryDistribution: { category: string; count: number }[];
  customerMetrics: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    averageTransactionValue: number;
  };
  inventoryMetrics: {
    totalProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    expiringProducts: number;
  };
}

const AnalyticsPage = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    new Date(), // Today
  ]);
  const [dateRangeType, setDateRangeType] = useState<string>('custom');
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary>({
    salesTrend: [],
    topSellingProducts: [],
    categoryDistribution: [],
    customerMetrics: {
      totalCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0,
      averageTransactionValue: 0,
    },
    inventoryMetrics: {
      totalProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      expiringProducts: 0,
    },
  });

  // Set date range based on selected type
  const handleDateRangeTypeChange = (value: string) => {
    setDateRangeType(value);
    const today = new Date();

    switch (value) {
      case 'daily':
        setDateRange([startOfDay(today), endOfDay(today)]);
        break;
      case 'weekly':
        setDateRange([
          startOfWeek(today, { weekStartsOn: 0 }),
          endOfWeek(today, { weekStartsOn: 0 }),
        ]);
        break;
      case 'monthly':
        setDateRange([startOfMonth(today), endOfMonth(today)]);
        break;
      case 'yearly':
        setDateRange([startOfYear(today), endOfYear(today)]);
        break;
      case 'custom':
        // Keep the current date range for custom
        break;
      default:
        break;
    }
  };

  // Fetch analytics data from API
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');

      // Simulate API call - replace with actual API call when backend is ready
      setTimeout(() => {
        const mockAnalyticsSummary: AnalyticsSummary = {
          salesTrend: [
            { period: 'Jan', value: 120000 },
            { period: 'Feb', value: 150000 },
            { period: 'Mar', value: 180000 },
            { period: 'Apr', value: 160000 },
            { period: 'May', value: 200000 },
            { period: 'Jun', value: 220000 },
          ],
          topSellingProducts: [
            { name: 'Paracetamol 500mg', quantity: 500, revenue: 50000 },
            { name: 'Amoxicillin 250mg', quantity: 300, revenue: 45000 },
            { name: 'Metformin 500mg', quantity: 250, revenue: 37500 },
            { name: 'Lisinopril 10mg', quantity: 200, revenue: 30000 },
            { name: 'Salbutamol Inhaler', quantity: 150, revenue: 75000 },
          ],
          categoryDistribution: [
            { category: 'Analgesic', count: 25 },
            { category: 'Antibiotic', count: 20 },
            { category: 'Antidiabetic', count: 15 },
            { category: 'Antihypertensive', count: 18 },
            { category: 'Bronchodilator', count: 12 },
            { category: 'Other', count: 30 },
          ],
          customerMetrics: {
            totalCustomers: 500,
            newCustomers: 50,
            returningCustomers: 450,
            averageTransactionValue: 2500,
          },
          inventoryMetrics: {
            totalProducts: 120,
            lowStockProducts: 15,
            outOfStockProducts: 5,
            expiringProducts: 10,
          },
        };

        setAnalyticsSummary(mockAnalyticsSummary);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to fetch analytics data. Please try again later.');
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  // Load data on component mount and when date range changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, dateRangeType, activeTab]);

  return (
    <Container size="xl" px="xs">
      <Paper shadow="xs" p="md" withBorder>
        <Group position="apart" mb="md">
          <Title order={2}>Pharmacy Analytics</Title>
          <Button leftSection={<IconDownload size={16} />} color="blue">
            Export Report
          </Button>
        </Group>

        {/* Date Range Picker */}
        <Stack spacing="md" mb="md">
          <Group>
            <Text weight={500}>Date Range:</Text>
            <SegmentedControl
              value={dateRangeType}
              onChange={handleDateRangeTypeChange}
              data={[
                { label: 'Daily', value: 'daily' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
                { label: 'Custom', value: 'custom' },
              ]}
            />
          </Group>

          <Group>
            {dateRangeType === 'custom' ? (
              <DatePicker
                type="range"
                label="Custom Date Range"
                placeholder="Select date range"
                value={dateRange}
                onChange={setDateRange}
                style={{ flex: 1 }}
                size="md"
                radius="md"
                clearable={false}
                firstDayOfWeek={0}
                styles={{
                  calendarHeader: { marginBottom: 10 },
                  monthCell: { padding: '5px 10px' },
                  yearCell: { padding: '5px 10px' },
                  day: { borderRadius: 4 },
                  weekday: { fontWeight: 600 },
                  weekend: { color: 'var(--mantine-color-red-6)' },
                  calendarHeaderControl: {
                    borderRadius: 4,
                    '&:hover': {
                      backgroundColor: 'var(--mantine-color-blue-0)',
                    },
                  },
                  monthPickerControl: {
                    borderRadius: 4,
                    '&:hover': {
                      backgroundColor: 'var(--mantine-color-blue-0)',
                    },
                  },
                  yearPickerControl: {
                    borderRadius: 4,
                    '&:hover': {
                      backgroundColor: 'var(--mantine-color-blue-0)',
                    },
                  },
                }}
              />
            ) : (
              <Text>
                <IconCalendar
                  size={16}
                  style={{ verticalAlign: 'middle', marginRight: 5 }}
                />
                {dateRange[0] && dateRange[1]
                  ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`
                  : 'Select date range'}
              </Text>
            )}
          </Group>
        </Stack>

        {/* Error Message */}
        {error && (
          <Alert color="red" title="Error" mb="md">
            {error}
            <Button
              variant="outline"
              color="red"
              size="xs"
              mt="xs"
              onClick={() => {
                setError('');
                fetchAnalyticsData();
              }}
            >
              Retry
            </Button>
          </Alert>
        )}

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab} mb="md">
          <Tabs.List>
            <Tabs.Tab
              value="overview"
              leftSection={<IconReportAnalytics size={16} />}
            >
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="sales" leftSection={<IconChartBar size={16} />}>
              Sales
            </Tabs.Tab>
            <Tabs.Tab value="inventory" leftSection={<IconPill size={16} />}>
              Inventory
            </Tabs.Tab>
            <Tabs.Tab value="customers" leftSection={<IconUsers size={16} />}>
              Customers
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {/* Analytics Content */}
        {loading ? (
          <Box py="xl" style={{ display: 'flex', justifyContent: 'center' }}>
            <Loader size="lg" />
          </Box>
        ) : !error ? (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Summary Cards */}
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="md">
                  <Card shadow="sm" p="lg" radius="md" withBorder>
                    <Group position="apart">
                      <Text weight={500}>Total Products</Text>
                      <ThemeIcon
                        color="blue"
                        variant="light"
                        size="lg"
                        radius="xl"
                      >
                        <IconPill size={20} />
                      </ThemeIcon>
                    </Group>
                    <Text size="xl" weight={700} mt="md">
                      {analyticsSummary.inventoryMetrics.totalProducts}
                    </Text>
                  </Card>
                  <Card shadow="sm" p="lg" radius="md" withBorder>
                    <Group position="apart">
                      <Text weight={500}>Total Customers</Text>
                      <ThemeIcon
                        color="green"
                        variant="light"
                        size="lg"
                        radius="xl"
                      >
                        <IconUsers size={20} />
                      </ThemeIcon>
                    </Group>
                    <Text size="xl" weight={700} mt="md">
                      {analyticsSummary.customerMetrics.totalCustomers}
                    </Text>
                  </Card>
                  <Card shadow="sm" p="lg" radius="md" withBorder>
                    <Group position="apart">
                      <Text weight={500}>Low Stock Items</Text>
                      <ThemeIcon
                        color="yellow"
                        variant="light"
                        size="lg"
                        radius="xl"
                      >
                        <IconArrowDown size={20} />
                      </ThemeIcon>
                    </Group>
                    <Text size="xl" weight={700} mt="md">
                      {analyticsSummary.inventoryMetrics.lowStockProducts}
                    </Text>
                  </Card>
                  <Card shadow="sm" p="lg" radius="md" withBorder>
                    <Group position="apart">
                      <Text weight={500}>Avg. Transaction</Text>
                      <ThemeIcon
                        color="cyan"
                        variant="light"
                        size="lg"
                        radius="xl"
                      >
                        <IconCurrencyNaira size={20} />
                      </ThemeIcon>
                    </Group>
                    <Text size="xl" weight={700} mt="md">
                      {formatCurrency(
                        analyticsSummary.customerMetrics.averageTransactionValue
                      )}
                    </Text>
                  </Card>
                </SimpleGrid>

                {/* Top Selling Products */}
                <Card shadow="sm" p="lg" radius="md" withBorder mb="md">
                  <Title order={4} mb="md">
                    Top Selling Products
                  </Title>
                  <Table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsSummary.topSellingProducts.map(
                        (product, index) => (
                          <tr key={index}>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>{formatCurrency(product.revenue)}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                </Card>
              </>
            )}

            {/* Sales Tab */}
            {activeTab === 'sales' && (
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                  Sales Trend
                </Title>
                <Text>Sales trend visualization would go here</Text>
              </Card>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                  Inventory Status
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
                  <Box>
                    <Text mb="xs">Low Stock Products</Text>
                    <Progress
                      value={
                        (analyticsSummary.inventoryMetrics.lowStockProducts /
                          analyticsSummary.inventoryMetrics.totalProducts) *
                        100
                      }
                      color="yellow"
                      size="xl"
                      radius="xl"
                      mb="md"
                      label={`${analyticsSummary.inventoryMetrics.lowStockProducts} products`}
                    />

                    <Text mb="xs">Out of Stock Products</Text>
                    <Progress
                      value={
                        (analyticsSummary.inventoryMetrics.outOfStockProducts /
                          analyticsSummary.inventoryMetrics.totalProducts) *
                        100
                      }
                      color="red"
                      size="xl"
                      radius="xl"
                      mb="md"
                      label={`${analyticsSummary.inventoryMetrics.outOfStockProducts} products`}
                    />

                    <Text mb="xs">Expiring Products</Text>
                    <Progress
                      value={
                        (analyticsSummary.inventoryMetrics.expiringProducts /
                          analyticsSummary.inventoryMetrics.totalProducts) *
                        100
                      }
                      color="orange"
                      size="xl"
                      radius="xl"
                      label={`${analyticsSummary.inventoryMetrics.expiringProducts} products`}
                    />
                  </Box>
                  <Box>
                    <Text mb="md">Category Distribution</Text>
                    <RingProgress
                      size={200}
                      thickness={30}
                      label={
                        <Text size="xs" align="center" weight={700}>
                          Categories
                        </Text>
                      }
                      sections={analyticsSummary.categoryDistribution.map(
                        (category, index) => ({
                          value:
                            (category.count /
                              analyticsSummary.categoryDistribution.reduce(
                                (acc, curr) => acc + curr.count,
                                0
                              )) *
                            100,
                          color: [
                            'blue',
                            'cyan',
                            'green',
                            'yellow',
                            'orange',
                            'red',
                          ][index % 6],
                          tooltip: `${category.category}: ${category.count} products`,
                        })
                      )}
                    />
                  </Box>
                </SimpleGrid>
              </Card>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                  Customer Metrics
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
                  <Box>
                    <Text mb="xs">New vs Returning Customers</Text>
                    <RingProgress
                      size={200}
                      thickness={30}
                      label={
                        <Text size="xs" align="center" weight={700}>
                          Customers
                        </Text>
                      }
                      sections={[
                        {
                          value:
                            (analyticsSummary.customerMetrics.newCustomers /
                              analyticsSummary.customerMetrics.totalCustomers) *
                            100,
                          color: 'green',
                          tooltip: `New: ${analyticsSummary.customerMetrics.newCustomers} customers`,
                        },
                        {
                          value:
                            (analyticsSummary.customerMetrics
                              .returningCustomers /
                              analyticsSummary.customerMetrics.totalCustomers) *
                            100,
                          color: 'blue',
                          tooltip: `Returning: ${analyticsSummary.customerMetrics.returningCustomers} customers`,
                        },
                      ]}
                    />
                  </Box>
                  <Box>
                    <List spacing="md">
                      <List.Item
                        icon={
                          <ThemeIcon color="blue" size={24} radius="xl">
                            <IconUsers size={16} />
                          </ThemeIcon>
                        }
                      >
                        <Text weight={500}>
                          Total Customers:{' '}
                          {analyticsSummary.customerMetrics.totalCustomers}
                        </Text>
                      </List.Item>
                      <List.Item
                        icon={
                          <ThemeIcon color="green" size={24} radius="xl">
                            <IconUsers size={16} />
                          </ThemeIcon>
                        }
                      >
                        <Text weight={500}>
                          New Customers:{' '}
                          {analyticsSummary.customerMetrics.newCustomers}
                        </Text>
                      </List.Item>
                      <List.Item
                        icon={
                          <ThemeIcon color="cyan" size={24} radius="xl">
                            <IconUsers size={16} />
                          </ThemeIcon>
                        }
                      >
                        <Text weight={500}>
                          Returning Customers:{' '}
                          {analyticsSummary.customerMetrics.returningCustomers}
                        </Text>
                      </List.Item>
                      <List.Item
                        icon={
                          <ThemeIcon color="yellow" size={24} radius="xl">
                            <IconCurrencyNaira size={16} />
                          </ThemeIcon>
                        }
                      >
                        <Text weight={500}>
                          Average Transaction:{' '}
                          {formatCurrency(
                            analyticsSummary.customerMetrics
                              .averageTransactionValue
                          )}
                        </Text>
                      </List.Item>
                    </List>
                  </Box>
                </SimpleGrid>
              </Card>
            )}
          </>
        ) : null}
      </Paper>
    </Container>
  );
};

export default AnalyticsPage;
