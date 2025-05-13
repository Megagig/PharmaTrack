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
} from '@mantine/core';
import { DateInput, DatePicker } from '@mantine/dates';
import { useAuthStore } from '../../../../store/authStore';
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
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

// Define types
interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  topIncomeCategories: { category: string; amount: number }[];
  topExpenseCategories: { category: string; amount: number }[];
  monthlySummary: {
    month: string;
    income: number;
    expenses: number;
    profit: number;
  }[];
}

const FinanceReportsPage = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    new Date(), // Today
  ]);
  const [reportType, setReportType] = useState<string>('summary');
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    topIncomeCategories: [],
    topExpenseCategories: [],
    monthlySummary: [],
  });

  // Fetch financial data from API
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError('');

      // Simulate API call - replace with actual API call when backend is ready
      setTimeout(() => {
        const mockFinancialSummary: FinancialSummary = {
          totalIncome: 250000,
          totalExpenses: 150000,
          netProfit: 100000,
          profitMargin: 40,
          topIncomeCategories: [
            { category: 'Sales', amount: 200000 },
            { category: 'Services', amount: 30000 },
            { category: 'Other', amount: 20000 },
          ],
          topExpenseCategories: [
            { category: 'Inventory', amount: 80000 },
            { category: 'Rent', amount: 30000 },
            { category: 'Utilities', amount: 20000 },
            { category: 'Salaries', amount: 15000 },
            { category: 'Other', amount: 5000 },
          ],
          monthlySummary: [
            { month: 'Jan', income: 220000, expenses: 130000, profit: 90000 },
            { month: 'Feb', income: 240000, expenses: 140000, profit: 100000 },
            { month: 'Mar', income: 250000, expenses: 150000, profit: 100000 },
          ],
        };

        setFinancialSummary(mockFinancialSummary);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setError('Failed to fetch financial data. Please try again later.');
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
    fetchFinancialData();
  }, [dateRange, reportType]);

  return (
    <Container size="xl" px="xs">
      <Paper shadow="xs" p="md" withBorder>
        <Group position="apart" mb="md">
          <Title order={2}>Financial Reports</Title>
          <Button leftSection={<IconDownload size={16} />} color="blue">
            Export Report
          </Button>
        </Group>

        {/* Report Controls */}
        <Group mb="md">
          <DatePicker
            type="range"
            label="Date Range"
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
                '&:hover': { backgroundColor: 'var(--mantine-color-blue-0)' },
              },
              monthPickerControl: {
                borderRadius: 4,
                '&:hover': { backgroundColor: 'var(--mantine-color-blue-0)' },
              },
              yearPickerControl: {
                borderRadius: 4,
                '&:hover': { backgroundColor: 'var(--mantine-color-blue-0)' },
              },
            }}
          />
          <Select
            label="Report Type"
            placeholder="Select report type"
            value={reportType}
            onChange={(value) => setReportType(value || 'summary')}
            data={[
              { value: 'summary', label: 'Financial Summary' },
              { value: 'income', label: 'Income Report' },
              { value: 'expense', label: 'Expense Report' },
              { value: 'profit', label: 'Profit & Loss' },
            ]}
            style={{ width: 200 }}
          />
        </Group>

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
                fetchFinancialData();
              }}
            >
              Retry
            </Button>
          </Alert>
        )}

        {/* Financial Report */}
        {loading ? (
          <Box py="xl" style={{ display: 'flex', justifyContent: 'center' }}>
            <Loader size="lg" />
          </Box>
        ) : !error ? (
          <>
            {/* Summary Cards */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Group position="apart">
                  <Text weight={500}>Total Income</Text>
                  <ThemeIcon
                    color="green"
                    variant="light"
                    size="lg"
                    radius="xl"
                  >
                    <IconArrowUp size={20} />
                  </ThemeIcon>
                </Group>
                <Text size="xl" weight={700} mt="md">
                  {formatCurrency(financialSummary.totalIncome)}
                </Text>
              </Card>
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Group position="apart">
                  <Text weight={500}>Total Expenses</Text>
                  <ThemeIcon color="red" variant="light" size="lg" radius="xl">
                    <IconArrowDown size={20} />
                  </ThemeIcon>
                </Group>
                <Text size="xl" weight={700} mt="md">
                  {formatCurrency(financialSummary.totalExpenses)}
                </Text>
              </Card>
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Group position="apart">
                  <Text weight={500}>Net Profit</Text>
                  <ThemeIcon color="blue" variant="light" size="lg" radius="xl">
                    <IconCurrencyNaira size={20} />
                  </ThemeIcon>
                </Group>
                <Text size="xl" weight={700} mt="md">
                  {formatCurrency(financialSummary.netProfit)}
                </Text>
                <Text size="sm" color="dimmed">
                  Profit Margin: {financialSummary.profitMargin}%
                </Text>
              </Card>
            </SimpleGrid>

            {/* Income & Expense Breakdown */}
            <Grid mb="md">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <Title order={4} mb="md">
                    Income Breakdown
                  </Title>
                  <Group position="apart">
                    <Box style={{ flex: 1 }}>
                      <List spacing="xs">
                        {financialSummary.topIncomeCategories.map(
                          (item, index) => (
                            <List.Item
                              key={index}
                              icon={
                                <ThemeIcon color="green" size={24} radius="xl">
                                  <IconCheck size={16} />
                                </ThemeIcon>
                              }
                            >
                              <Group position="apart">
                                <Text>{item.category}</Text>
                                <Text weight={500}>
                                  {formatCurrency(item.amount)}
                                </Text>
                              </Group>
                            </List.Item>
                          )
                        )}
                      </List>
                    </Box>
                    <RingProgress
                      size={150}
                      thickness={20}
                      label={
                        <Text size="xs" align="center" weight={700}>
                          Income
                        </Text>
                      }
                      sections={financialSummary.topIncomeCategories.map(
                        (item, index) => ({
                          value:
                            (item.amount / financialSummary.totalIncome) * 100,
                          color: ['green', 'teal', 'cyan', 'blue', 'indigo'][
                            index % 5
                          ],
                          tooltip: `${item.category}: ${formatCurrency(
                            item.amount
                          )}`,
                        })
                      )}
                    />
                  </Group>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <Title order={4} mb="md">
                    Expense Breakdown
                  </Title>
                  <Group position="apart">
                    <Box style={{ flex: 1 }}>
                      <List spacing="xs">
                        {financialSummary.topExpenseCategories.map(
                          (item, index) => (
                            <List.Item
                              key={index}
                              icon={
                                <ThemeIcon color="red" size={24} radius="xl">
                                  <IconCheck size={16} />
                                </ThemeIcon>
                              }
                            >
                              <Group position="apart">
                                <Text>{item.category}</Text>
                                <Text weight={500}>
                                  {formatCurrency(item.amount)}
                                </Text>
                              </Group>
                            </List.Item>
                          )
                        )}
                      </List>
                    </Box>
                    <RingProgress
                      size={150}
                      thickness={20}
                      label={
                        <Text size="xs" align="center" weight={700}>
                          Expenses
                        </Text>
                      }
                      sections={financialSummary.topExpenseCategories.map(
                        (item, index) => ({
                          value:
                            (item.amount / financialSummary.totalExpenses) *
                            100,
                          color: ['red', 'orange', 'yellow', 'pink', 'grape'][
                            index % 5
                          ],
                          tooltip: `${item.category}: ${formatCurrency(
                            item.amount
                          )}`,
                        })
                      )}
                    />
                  </Group>
                </Card>
              </Grid.Col>
            </Grid>
          </>
        ) : null}
      </Paper>
    </Container>
  );
};

export default FinanceReportsPage;
