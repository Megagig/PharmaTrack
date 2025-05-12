import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Group,
  RingProgress,
  Badge,
  SimpleGrid,
  Paper,
  useMantineTheme,
  Button,
  Loader
} from '@mantine/core';
import {
  IconPackage,
  IconAlertTriangle,
  IconTruckDelivery,
  IconShoppingCart,
  IconUsers,
  IconArrowUpRight,
  IconArrowDownRight,
  IconCash,
  IconCalendarStats
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config';
import { useAuthStore } from '../../../store/authStore';
import { formatCurrency } from '../../../utils/currency';

interface InventorySummary {
  totalProducts: number;
  lowStockProducts: number;
  expiringProducts: number;
  totalSuppliers: number;
  purchasesThisMonth: number;
  salesThisMonth: number;
  inventoryValue: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: 'PURCHASE' | 'SALE';
    date: string;
    amount: number;
    reference: string;
  }>;
}

export function InventoryDashboard() {
  const theme = useMantineTheme();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<InventorySummary | null>(null);

  useEffect(() => {
    fetchInventorySummary();
  }, []);

  const fetchInventorySummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/inventory/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSummary(response.data.data.summary);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
      setLoading(false);
    }
  };

  // Fallback data if API call fails
  const fallbackSummary: InventorySummary = {
    totalProducts: 0,
    lowStockProducts: 0,
    expiringProducts: 0,
    totalSuppliers: 0,
    purchasesThisMonth: 0,
    salesThisMonth: 0,
    inventoryValue: 0,
    topSellingProducts: [],
    recentTransactions: []
  };

  const data = summary || fallbackSummary;

  // Calculate percentage of low stock products
  const lowStockPercentage = data.totalProducts > 0 
    ? Math.round((data.lowStockProducts / data.totalProducts) * 100) 
    : 0;

  return (
    <Container size="xl" px="xs">
      <Title order={2} mb="md">
        Inventory Dashboard
      </Title>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Loader size="lg" />
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="md">
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">Total Products</Text>
                  <Text fw={700} size="xl">{data.totalProducts}</Text>
                </div>
                <IconPackage size={30} color={theme.colors.blue[6]} />
              </Group>
              <Button 
                variant="light" 
                color="blue" 
                fullWidth 
                mt="md" 
                component={Link} 
                to="/pharmacy/inventory/products"
              >
                View Products
              </Button>
            </Card>

            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">Low Stock Items</Text>
                  <Group align="flex-end" gap="xs">
                    <Text fw={700} size="xl">{data.lowStockProducts}</Text>
                    <Badge color={data.lowStockProducts > 0 ? "orange" : "green"} size="sm">
                      {lowStockPercentage}%
                    </Badge>
                  </Group>
                </div>
                <IconAlertTriangle size={30} color={theme.colors.orange[6]} />
              </Group>
              <Button 
                variant="light" 
                color="orange" 
                fullWidth 
                mt="md" 
                component={Link} 
                to="/pharmacy/inventory/products?tab=low-stock"
              >
                Check Low Stock
              </Button>
            </Card>

            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">Suppliers</Text>
                  <Text fw={700} size="xl">{data.totalSuppliers}</Text>
                </div>
                <IconUsers size={30} color={theme.colors.indigo[6]} />
              </Group>
              <Button 
                variant="light" 
                color="indigo" 
                fullWidth 
                mt="md" 
                component={Link} 
                to="/pharmacy/inventory/suppliers"
              >
                Manage Suppliers
              </Button>
            </Card>

            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">Inventory Value</Text>
                  <Text fw={700} size="xl">${data.inventoryValue.toLocaleString()}</Text>
                </div>
                <IconCash size={30} color={theme.colors.green[6]} />
              </Group>
              <Button 
                variant="light" 
                color="green" 
                fullWidth 
                mt="md" 
                component={Link} 
                to="/pharmacy/inventory/products"
              >
                View Inventory
              </Button>
            </Card>
          </SimpleGrid>

          {/* Monthly Activity */}
          <Grid mb="md">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Title order={4} mb="md">Monthly Activity</Title>
                <Grid>
                  <Grid.Col span={6}>
                    <Paper p="md" radius="md" withBorder>
                      <Group>
                        <IconTruckDelivery size={30} color={theme.colors.blue[6]} />
                        <div>
                          <Text size="xs" c="dimmed">Purchases This Month</Text>
                          <Group align="center" gap="xs">
                            <Text fw={700} size="xl">{data.purchasesThisMonth}</Text>
                            <IconArrowUpRight size={20} color={theme.colors.green[6]} />
                          </Group>
                        </div>
                      </Group>
                      <Button 
                        variant="subtle" 
                        color="blue" 
                        fullWidth 
                        mt="md" 
                        component={Link} 
                        to="/pharmacy/inventory/purchases"
                      >
                        View Purchases
                      </Button>
                    </Paper>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Paper p="md" radius="md" withBorder>
                      <Group>
                        <IconShoppingCart size={30} color={theme.colors.teal[6]} />
                        <div>
                          <Text size="xs" c="dimmed">Sales This Month</Text>
                          <Group align="center" gap="xs">
                            <Text fw={700} size="xl">{data.salesThisMonth}</Text>
                            <IconArrowUpRight size={20} color={theme.colors.green[6]} />
                          </Group>
                        </div>
                      </Group>
                      <Button 
                        variant="subtle" 
                        color="teal" 
                        fullWidth 
                        mt="md" 
                        component={Link} 
                        to="/pharmacy/inventory/sales"
                      >
                        View Sales
                      </Button>
                    </Paper>
                  </Grid.Col>
                </Grid>

                <Title order={5} mt="xl" mb="sm">Recent Transactions</Title>
                {data.recentTransactions.length === 0 ? (
                  <Text c="dimmed" ta="center" py="md">No recent transactions</Text>
                ) : (
                  <div>
                    {data.recentTransactions.map((transaction) => (
                      <Paper key={transaction.id} p="sm" mb="xs" withBorder>
                        <Group justify="space-between">
                          <Group>
                            {transaction.type === 'PURCHASE' ? (
                              <IconArrowDownRight size={20} color={theme.colors.red[6]} />
                            ) : (
                              <IconArrowUpRight size={20} color={theme.colors.green[6]} />
                            )}
                            <div>
                              <Text size="sm" fw={500}>{transaction.type}</Text>
                              <Text size="xs" c="dimmed">{transaction.reference}</Text>
                            </div>
                          </Group>
                          <div>
                            <Text ta="right" fw={500}>
                              {transaction.type === 'PURCHASE' ? '-' : '+'} {formatCurrency(transaction.amount)}
                            </Text>
                            <Text size="xs" c="dimmed" ta="right">
                              {new Date(transaction.date).toLocaleDateString()}
                            </Text>
                          </div>
                        </Group>
                      </Paper>
                    ))}
                  </div>
                )}
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card shadow="sm" p="lg" radius="md" withBorder h="100%">
                <Title order={4} mb="md">Inventory Status</Title>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <RingProgress
                    size={180}
                    thickness={20}
                    roundCaps
                    sections={[
                      { value: lowStockPercentage, color: 'orange' },
                      { value: 100 - lowStockPercentage, color: 'teal' },
                    ]}
                    label={
                      <div style={{ textAlign: 'center' }}>
                        <Text fw={700} size="xl">{lowStockPercentage}%</Text>
                        <Text size="xs" c="dimmed">Low Stock</Text>
                      </div>
                    }
                  />
                </div>

                <Group mb="md">
                  <Badge color="teal" size="lg" radius="sm">
                    {data.totalProducts - data.lowStockProducts} In Stock
                  </Badge>
                  <Badge color="orange" size="lg" radius="sm">
                    {data.lowStockProducts} Low Stock
                  </Badge>
                  <Badge color="red" size="lg" radius="sm">
                    {data.expiringProducts} Expiring Soon
                  </Badge>
                </Group>

                <Button 
                  leftSection={<IconCalendarStats size={16} />}
                  variant="outline" 
                  color="blue" 
                  fullWidth 
                  component={Link} 
                  to="/pharmacy/inventory/products"
                >
                  View Detailed Report
                </Button>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Top Selling Products */}
          <Card shadow="sm" p="lg" radius="md" withBorder mb="md">
            <Title order={4} mb="md">Top Selling Products</Title>
            {data.topSellingProducts.length === 0 ? (
              <Text c="dimmed" ta="center" py="md">No sales data available</Text>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                {data.topSellingProducts.map((product) => (
                  <Paper key={product.id} p="md" radius="md" withBorder>
                    <Text fw={500}>{product.name}</Text>
                    <Group justify="space-between" mt="xs">
                      <Text size="sm">Quantity: {product.quantity}</Text>
                      <Text size="sm" fw={500}>Revenue: {formatCurrency(product.revenue)}</Text>
                    </Group>
                  </Paper>
                ))}
              </SimpleGrid>
            )}
          </Card>

          {/* Quick Actions */}
          <SimpleGrid cols={{ base: 2, sm: 4 }} mb="md">
            <Button 
              leftSection={<IconPackage size={16} />}
              component={Link} 
              to="/pharmacy/inventory/products"
              variant="light"
              color="blue"
              fullWidth
            >
              Manage Products
            </Button>
            <Button 
              leftSection={<IconTruckDelivery size={16} />}
              component={Link} 
              to="/pharmacy/inventory/purchases"
              variant="light"
              color="indigo"
              fullWidth
            >
              New Purchase
            </Button>
            <Button 
              leftSection={<IconShoppingCart size={16} />}
              component={Link} 
              to="/pharmacy/inventory/sales"
              variant="light"
              color="teal"
              fullWidth
            >
              New Sale
            </Button>
            <Button 
              leftSection={<IconUsers size={16} />}
              component={Link} 
              to="/pharmacy/inventory/suppliers"
              variant="light"
              color="grape"
              fullWidth
            >
              Suppliers
            </Button>
          </SimpleGrid>
        </>
      )}
    </Container>
  );
}
