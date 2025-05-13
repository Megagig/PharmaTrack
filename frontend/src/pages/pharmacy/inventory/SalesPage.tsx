import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Group,
  Button,
  TextInput,
  Table,
  ActionIcon,
  Menu,
  Card,
  Text,
  Loader,
  Pagination,
  Select,
  Badge,
  Tabs,
  Modal,
  Grid,
  Divider,
  NumberInput,
  Textarea,
  Paper,
  CloseButton,
  Alert,
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconRefresh,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
  IconReceipt,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { API_URL } from '../../../config';
import { useAuthStore } from '../../../store/authStore';
import { format } from 'date-fns';
import { formatCurrency } from '../../../utils/currency';

interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
}

interface Sale {
  id: string;
  invoiceNumber: string;
  saleDate: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  totalAmount: number;
  discount: number;
  tax: number;
  paymentStatus: 'PAID' | 'UNPAID' | 'PARTIAL';
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: SaleItem[];
}

export function SalesPage() {
  // Form state for adding items
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemDiscount, setItemDiscount] = useState<number>(0);

  // Sale form
  const form = useForm({
    initialValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      invoiceNumber: '',
      saleDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'UNPAID' as 'PAID' | 'UNPAID' | 'PARTIAL',
      paymentMethod: 'CASH',
      discount: 0,
      tax: 0,
      notes: '',
    },
    validate: {
      customerName: (value) => (value ? null : 'Customer name is required'),
      invoiceNumber: (value) => (value ? null : 'Invoice number is required'),
      saleDate: (value) => (value ? null : 'Sale date is required'),
      paymentStatus: (value) => (value ? null : 'Payment status is required'),
      paymentMethod: (value) => (value ? null : 'Payment method is required'),
    },
  });

  const [detailsOpened, { open: openDetails, close: closeDetails }] =
    useDisclosure(false);
  const [formOpened, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [products, setProducts] = useState<
    { value: string; label: string; price: number }[]
  >([]);
  const [formItems, setFormItems] = useState<
    {
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      discount: number;
      totalPrice: number;
    }[]
  >([]);
  const [editMode, setEditMode] = useState(false);
  const [currentSaleId, setCurrentSaleId] = useState<string | null>(null);
  const { token } = useAuthStore();
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | null>(
    null
  );
  const [sortField, setSortField] = useState<string>('saleDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  // Helper function to check if a date is today
  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    filterSales();
  }, [searchQuery, paymentStatusFilter, sales, sortField, sortDirection]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/sales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSales(response.data.data.sales);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sales:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch sales. Please try again.',
        color: 'red',
      });
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productOptions = response.data.data.products.map(
        (product: any) => ({
          value: product.id,
          label: product.name,
          price: product.retailPrice,
        })
      );
      setProducts(productOptions);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpenCreateModal = () => {
    setEditMode(false);
    setCurrentSaleId(null);
    form.reset();
    form.setValues({
      ...form.values,
      saleDate: new Date().toISOString().split('T')[0],
      invoiceNumber: generateInvoiceNumber(),
    });
    setFormItems([]);
    openForm();
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  const handleEditSale = async (sale: Sale) => {
    setEditMode(true);
    setCurrentSaleId(sale.id);

    form.setValues({
      customerName: sale.customerName,
      customerPhone: sale.customerPhone || '',
      customerEmail: sale.customerEmail || '',
      invoiceNumber: sale.invoiceNumber,
      saleDate: new Date(sale.saleDate).toISOString().split('T')[0],
      paymentStatus: sale.paymentStatus,
      paymentMethod: sale.paymentMethod,
      discount: sale.discount,
      tax: sale.tax,
      notes: sale.notes || '',
    });

    try {
      const response = await axios.get(`${API_URL}/sales/${sale.id}/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const items = response.data.data.items.map((item: SaleItem) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        totalPrice: item.totalPrice,
      }));

      setFormItems(items);
      openForm();
    } catch (error) {
      console.error('Error fetching sale items for edit:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load sale details for editing.',
        color: 'red',
      });
    }
  };

  const addItemToForm = () => {
    if (!selectedProduct) {
      notifications.show({
        title: 'Error',
        message: 'Please select a product',
        color: 'red',
      });
      return;
    }

    const product = products.find((p) => p.value === selectedProduct);
    if (!product) return;

    const price = itemPrice > 0 ? itemPrice : product.price;
    const totalPrice = price * itemQuantity - itemDiscount;

    const newItem = {
      productId: selectedProduct,
      productName: product.label,
      quantity: itemQuantity,
      unitPrice: price,
      discount: itemDiscount,
      totalPrice: totalPrice,
    };

    setFormItems([...formItems, newItem]);

    // Reset form
    setSelectedProduct(null);
    setItemQuantity(1);
    setItemPrice(0);
    setItemDiscount(0);
  };

  const removeItemFromForm = (index: number) => {
    const newItems = [...formItems];
    newItems.splice(index, 1);
    setFormItems(newItems);
  };

  const calculateSubtotal = () => {
    return formItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const calculateTotalDiscount = () => {
    const itemsDiscount = formItems.reduce(
      (total, item) => total + item.discount,
      0
    );
    return itemsDiscount + (form.values.discount || 0);
  };

  const calculateTotalAmount = () => {
    const subtotal = calculateSubtotal();
    const additionalDiscount = form.values.discount || 0;
    const tax = form.values.tax || 0;
    return subtotal - additionalDiscount + tax;
  };

  const handleSubmitSale = async (values: typeof form.values) => {
    if (formItems.length === 0) {
      notifications.show({
        title: 'Error',
        message: 'Please add at least one item to the sale',
        color: 'red',
      });
      return;
    }

    const saleData = {
      ...values,
      totalAmount: calculateTotalAmount(),
      items: formItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
      })),
    };

    try {
      if (editMode && currentSaleId) {
        await axios.patch(`${API_URL}/sales/${currentSaleId}`, saleData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({
          title: 'Success',
          message: 'Sale updated successfully',
          color: 'teal',
        });
      } else {
        await axios.post(`${API_URL}/sales`, saleData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({
          title: 'Success',
          message: 'Sale created successfully',
          color: 'teal',
        });
      }

      closeForm();
      form.reset();
      setFormItems([]);
      fetchSales();
    } catch (error: any) {
      console.error('Error saving sale:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to save sale. Please try again.';
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    }
  };

  const viewSaleDetails = async (sale: Sale) => {
    setSelectedSale(sale);

    try {
      const response = await axios.get(`${API_URL}/sales/${sale.id}/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSaleItems(response.data.data.items);
    } catch (error) {
      console.error('Error fetching sale items:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch sale items. Please try again.',
        color: 'red',
      });
      setSaleItems([]);
    }

    openDetails();
  };

  const updateSalePaymentStatus = async (
    saleId: string,
    status: 'PAID' | 'UNPAID' | 'PARTIAL'
  ) => {
    try {
      await axios.patch(
        `${API_URL}/sales/${saleId}`,
        {
          paymentStatus: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      notifications.show({
        title: 'Success',
        message: `Sale marked as ${status.toLowerCase()}`,
        color: 'teal',
      });

      // Refresh sales data
      fetchSales();
    } catch (error) {
      console.error('Error updating payment status:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update payment status. Please try again.',
        color: 'red',
      });
    }
  };

  const filterSales = () => {
    let filtered = [...sales];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (sale) =>
          sale.invoiceNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (sale.customerPhone && sale.customerPhone.includes(searchQuery)) ||
          (sale.customerEmail &&
            sale.customerEmail
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    // Apply payment status filter
    if (paymentStatusFilter) {
      filtered = filtered.filter(
        (sale) => sale.paymentStatus === paymentStatusFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const fieldA = a[sortField as keyof Sale];
      const fieldB = b[sortField as keyof Sale];

      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        // Handle date fields specially
        if (sortField === 'saleDate') {
          return sortDirection === 'asc'
            ? new Date(fieldA).getTime() - new Date(fieldB).getTime()
            : new Date(fieldB).getTime() - new Date(fieldA).getTime();
        }
        return sortDirection === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      } else {
        // Handle numeric fields
        const numA = Number(fieldA) || 0;
        const numB = Number(fieldB) || 0;
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }
    });

    setFilteredSales(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPaymentStatusFilter(null);
    setSortField('saleDate');
    setSortDirection('desc');
  };

  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPaymentStatus = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge color="green">Paid</Badge>;
      case 'UNPAID':
        return <Badge color="red">Unpaid</Badge>;
      case 'PARTIAL':
        return <Badge color="orange">Partial</Badge>;
      default:
        return <Badge color="gray">{status}</Badge>;
    }
  };

  return (
    <Container size="xl" px="xs">
      <Title order={2} mb="md">
        Sales Management
      </Title>

      <Tabs defaultValue="all">
        <Tabs.List mb="md">
          <Tabs.Tab value="all" leftSection={<IconReceipt size={16} />}>
            All Sales
          </Tabs.Tab>
          <Tabs.Tab value="today" leftSection={<IconReceipt size={16} />}>
            Today's Sales
          </Tabs.Tab>
          <Tabs.Tab value="unpaid" leftSection={<IconReceipt size={16} />}>
            Unpaid
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all">
          <Card shadow="sm" p="md" radius="md" mb="md">
            <Group justify="space-between" mb="md">
              <Group>
                <TextInput
                  placeholder="Search sales..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  leftSection={<IconSearch size={16} />}
                />
                <Select
                  placeholder="Filter by payment status"
                  data={[
                    { value: 'PAID', label: 'Paid' },
                    { value: 'UNPAID', label: 'Unpaid' },
                    { value: 'PARTIAL', label: 'Partial' },
                  ]}
                  value={paymentStatusFilter}
                  onChange={setPaymentStatusFilter}
                  clearable
                  leftSection={<IconFilter size={16} />}
                />
                <Button
                  variant="subtle"
                  leftSection={<IconRefresh size={16} />}
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </Group>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={handleOpenCreateModal}
              >
                New Sale
              </Button>
            </Group>

            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '20px',
                }}
              >
                <Loader />
              </div>
            ) : paginatedSales.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No sales found. Try adjusting your filters or create a new sale.
              </Text>
            ) : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>
                        <Group
                          gap={5}
                          onClick={() => handleSort('invoiceNumber')}
                          style={{ cursor: 'pointer' }}
                        >
                          Invoice #
                          {sortField === 'invoiceNumber' &&
                            (sortDirection === 'asc' ? (
                              <IconSortAscending size={16} />
                            ) : (
                              <IconSortDescending size={16} />
                            ))}
                        </Group>
                      </Table.Th>
                      <Table.Th>
                        <Group
                          gap={5}
                          onClick={() => handleSort('saleDate')}
                          style={{ cursor: 'pointer' }}
                        >
                          Date
                          {sortField === 'saleDate' &&
                            (sortDirection === 'asc' ? (
                              <IconSortAscending size={16} />
                            ) : (
                              <IconSortDescending size={16} />
                            ))}
                        </Group>
                      </Table.Th>
                      <Table.Th>
                        <Group
                          gap={5}
                          onClick={() => handleSort('customerName')}
                          style={{ cursor: 'pointer' }}
                        >
                          Customer
                          {sortField === 'customerName' &&
                            (sortDirection === 'asc' ? (
                              <IconSortAscending size={16} />
                            ) : (
                              <IconSortDescending size={16} />
                            ))}
                        </Group>
                      </Table.Th>
                      <Table.Th>
                        <Group
                          gap={5}
                          onClick={() => handleSort('totalAmount')}
                          style={{ cursor: 'pointer' }}
                        >
                          Amount
                          {sortField === 'totalAmount' &&
                            (sortDirection === 'asc' ? (
                              <IconSortAscending size={16} />
                            ) : (
                              <IconSortDescending size={16} />
                            ))}
                        </Group>
                      </Table.Th>
                      <Table.Th>Payment Status</Table.Th>
                      <Table.Th>Payment Method</Table.Th>
                      <Table.Th style={{ width: 80 }}>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedSales.map((sale) => (
                      <Table.Tr key={sale.id}>
                        <Table.Td>{sale.invoiceNumber}</Table.Td>
                        <Table.Td>
                          {format(new Date(sale.saleDate), 'MMM dd, yyyy')}
                        </Table.Td>
                        <Table.Td>{sale.customerName}</Table.Td>
                        <Table.Td>{formatCurrency(sale.totalAmount)}</Table.Td>
                        <Table.Td>
                          {renderPaymentStatus(sale.paymentStatus)}
                        </Table.Td>
                        <Table.Td>{sale.paymentMethod}</Table.Td>
                        <Table.Td>
                          <Menu position="bottom-end" withArrow>
                            <Menu.Target>
                              <ActionIcon variant="subtle">
                                <IconDotsVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                leftSection={<IconEye size={16} />}
                                onClick={() => viewSaleDetails(sale)}
                              >
                                View Details
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconEdit size={16} />}
                                onClick={() => handleEditSale(sale)}
                              >
                                Edit
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>

                <Group justify="center" mt="md">
                  <Pagination
                    value={currentPage}
                    onChange={setCurrentPage}
                    total={totalPages}
                  />
                </Group>
              </>
            )}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="today">
          <Card shadow="sm" p="md" radius="md" mb="md">
            <Title order={4} mb="md">
              Today's Sales
            </Title>
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '20px',
                }}
              >
                <Loader />
              </div>
            ) : sales.filter((s) => isToday(s.saleDate)).length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No sales recorded today.
              </Text>
            ) : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Invoice #</Table.Th>
                      <Table.Th>Time</Table.Th>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Payment Status</Table.Th>
                      <Table.Th>Payment Method</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {sales
                      .filter((s) => isToday(s.saleDate))
                      .sort(
                        (a, b) =>
                          new Date(b.saleDate).getTime() -
                          new Date(a.saleDate).getTime()
                      )
                      .map((sale) => (
                        <Table.Tr key={sale.id}>
                          <Table.Td>{sale.invoiceNumber}</Table.Td>
                          <Table.Td>
                            {format(new Date(sale.saleDate), 'h:mm a')}
                          </Table.Td>
                          <Table.Td>{sale.customerName}</Table.Td>
                          <Table.Td>
                            {formatCurrency(sale.totalAmount)}
                          </Table.Td>
                          <Table.Td>
                            {renderPaymentStatus(sale.paymentStatus)}
                          </Table.Td>
                          <Table.Td>{sale.paymentMethod}</Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => viewSaleDetails(sale)}
                              >
                                View
                              </Button>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>

                <Group justify="space-between" mt="md">
                  <div>
                    <Text fw={500}>Today's Total Sales:</Text>
                    <Text size="lg" fw={700}>
                      {formatCurrency(
                        sales
                          .filter((s) => isToday(s.saleDate))
                          .reduce((sum, sale) => sum + sale.totalAmount, 0)
                      )}
                    </Text>
                  </div>
                  <div>
                    <Text fw={500}>Number of Sales:</Text>
                    <Text size="lg" fw={700} ta="center">
                      {sales.filter((s) => isToday(s.saleDate)).length}
                    </Text>
                  </div>
                </Group>
              </>
            )}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="unpaid">
          <Card shadow="sm" p="md" radius="md" mb="md">
            <Title order={4} mb="md">
              Unpaid Sales
            </Title>
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '20px',
                }}
              >
                <Loader />
              </div>
            ) : sales.filter((s) => s.paymentStatus === 'UNPAID').length ===
              0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No unpaid sales found.
              </Text>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Invoice #</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {sales
                    .filter((s) => s.paymentStatus === 'UNPAID')
                    .map((sale) => (
                      <Table.Tr key={sale.id}>
                        <Table.Td>{sale.invoiceNumber}</Table.Td>
                        <Table.Td>
                          {format(new Date(sale.saleDate), 'MMM dd, yyyy')}
                        </Table.Td>
                        <Table.Td>{sale.customerName}</Table.Td>
                        <Table.Td>{formatCurrency(sale.totalAmount)}</Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => viewSaleDetails(sale)}
                            >
                              View
                            </Button>
                            <Button
                              size="xs"
                              variant="filled"
                              color="green"
                              onClick={() =>
                                updateSalePaymentStatus(sale.id, 'PAID')
                              }
                            >
                              Mark as Paid
                            </Button>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                </Table.Tbody>
              </Table>
            )}
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Sale details modal */}
      <Modal
        opened={detailsOpened}
        onClose={closeDetails}
        title={`Sale Details - ${selectedSale?.invoiceNumber || ''}`}
        size="lg"
      >
        {selectedSale && (
          <>
            <Grid>
              <Grid.Col span={6}>
                <Text fw={500}>Customer:</Text>
                <Text>{selectedSale.customerName}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fw={500}>Date:</Text>
                <Text>
                  {format(new Date(selectedSale.saleDate), 'MMMM dd, yyyy')}
                </Text>
              </Grid.Col>

              {selectedSale.customerPhone && (
                <Grid.Col span={6}>
                  <Text fw={500}>Phone:</Text>
                  <Text>{selectedSale.customerPhone}</Text>
                </Grid.Col>
              )}

              {selectedSale.customerEmail && (
                <Grid.Col span={6}>
                  <Text fw={500}>Email:</Text>
                  <Text>{selectedSale.customerEmail}</Text>
                </Grid.Col>
              )}

              <Grid.Col span={4}>
                <Text fw={500}>Payment Status:</Text>
                <Text>{renderPaymentStatus(selectedSale.paymentStatus)}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text fw={500}>Payment Method:</Text>
                <Text>{selectedSale.paymentMethod}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text fw={500}>Tax:</Text>
                <Text>{formatCurrency(selectedSale.tax)}</Text>
              </Grid.Col>

              {selectedSale.notes && (
                <Grid.Col span={12}>
                  <Text fw={500}>Notes:</Text>
                  <Text>{selectedSale.notes}</Text>
                </Grid.Col>
              )}
            </Grid>

            <Title order={5} mt="md" mb="xs">
              Sale Items:
            </Title>
            {saleItems.length === 0 ? (
              <Text c="dimmed">No items found for this sale.</Text>
            ) : (
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Unit Price</Table.Th>
                    <Table.Th>Discount</Table.Th>
                    <Table.Th>Total</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {saleItems.map((item) => (
                    <Table.Tr key={item.id}>
                      <Table.Td>{item.productName}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>{formatCurrency(item.unitPrice)}</Table.Td>
                      <Table.Td>
                        {item.discount
                          ? formatCurrency(item.discount)
                          : formatCurrency(0)}
                      </Table.Td>
                      <Table.Td>{formatCurrency(item.totalPrice)}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}

            <Group justify="space-between" mt="md">
              <div>
                <Text fw={500}>Subtotal:</Text>
                <Text>
                  {formatCurrency(selectedSale.totalAmount - selectedSale.tax)}
                </Text>
              </div>
              <div>
                <Text fw={500}>Discount:</Text>
                <Text>{formatCurrency(selectedSale.discount)}</Text>
              </div>
              <div>
                <Text fw={500}>Tax:</Text>
                <Text>{formatCurrency(selectedSale.tax)}</Text>
              </div>
              <div>
                <Text fw={500}>Total Amount:</Text>
                <Text size="lg" fw={700}>
                  {formatCurrency(selectedSale.totalAmount)}
                </Text>
              </div>
            </Group>

            <Group justify="flex-end" mt="xl">
              {selectedSale.paymentStatus !== 'PAID' && (
                <Button
                  color="green"
                  onClick={() => {
                    updateSalePaymentStatus(selectedSale.id, 'PAID');
                    closeDetails();
                  }}
                >
                  Mark as Paid
                </Button>
              )}
              <Button variant="outline" onClick={closeDetails}>
                Close
              </Button>
            </Group>
          </>
        )}
      </Modal>

      {/* Sale form modal */}
      <Modal
        opened={formOpened}
        onClose={() => {
          closeForm();
          form.reset();
          setFormItems([]);
        }}
        title={editMode ? 'Edit Sale' : 'Create New Sale'}
        size="xl"
      >
        <form onSubmit={form.onSubmit(handleSubmitSale)}>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Customer Name"
                placeholder="Enter customer name"
                required
                {...form.getInputProps('customerName')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Invoice Number"
                placeholder="Enter invoice number"
                required
                {...form.getInputProps('invoiceNumber')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Phone"
                placeholder="Enter phone number"
                {...form.getInputProps('customerPhone')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Sale Date"
                placeholder="YYYY-MM-DD"
                required
                {...form.getInputProps('saleDate')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Email"
                placeholder="Enter email address"
                {...form.getInputProps('customerEmail')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Payment Status"
                placeholder="Select payment status"
                data={[
                  { value: 'PAID', label: 'Paid' },
                  { value: 'UNPAID', label: 'Unpaid' },
                  { value: 'PARTIAL', label: 'Partial' },
                ]}
                required
                {...form.getInputProps('paymentStatus')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Payment Method"
                placeholder="Select payment method"
                data={[
                  { value: 'CASH', label: 'Cash' },
                  { value: 'CARD', label: 'Card' },
                  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                  { value: 'CHECK', label: 'Check' },
                  { value: 'CREDIT', label: 'Credit' },
                ]}
                required
                {...form.getInputProps('paymentMethod')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Discount"
                placeholder="0.00"
                min={0}
                {...form.getInputProps('discount')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Tax"
                placeholder="0.00"
                min={0}
                {...form.getInputProps('tax')}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Notes"
                placeholder="Enter any additional notes"
                {...form.getInputProps('notes')}
              />
            </Grid.Col>
          </Grid>

          <Title order={4} mt="md" mb="sm">
            Sale Items
          </Title>

          <Group mb="md">
            <Select
              placeholder="Select product"
              data={products}
              searchable
              value={selectedProduct}
              onChange={setSelectedProduct}
              style={{ width: '250px' }}
            />
            <NumberInput
              placeholder="Quantity"
              min={1}
              value={itemQuantity}
              onChange={(val) =>
                setItemQuantity(typeof val === 'number' ? val : 1)
              }
              style={{ width: '100px' }}
            />
            <NumberInput
              placeholder="Unit Price"
              min={0}
              value={itemPrice}
              onChange={(val) =>
                setItemPrice(typeof val === 'number' ? val : 0)
              }
              style={{ width: '120px' }}
            />
            <NumberInput
              placeholder="Discount"
              min={0}
              value={itemDiscount}
              onChange={(val) =>
                setItemDiscount(typeof val === 'number' ? val : 0)
              }
              style={{ width: '120px' }}
            />
            <Button onClick={addItemToForm}>Add Item</Button>
          </Group>

          {formItems.length === 0 ? (
            <Alert color="blue" title="No items added">
              Please add at least one item to this sale.
            </Alert>
          ) : (
            <Paper withBorder p="md" mb="md">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Unit Price</Table.Th>
                    <Table.Th>Discount</Table.Th>
                    <Table.Th>Total</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {formItems.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{item.productName}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>{formatCurrency(item.unitPrice)}</Table.Td>
                      <Table.Td>{formatCurrency(item.discount)}</Table.Td>
                      <Table.Td>{formatCurrency(item.totalPrice)}</Table.Td>
                      <Table.Td>
                        <CloseButton
                          onClick={() => removeItemFromForm(index)}
                          title="Remove item"
                        />
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              <Group justify="flex-end" mt="md">
                <div>
                  <Text fw={500}>Subtotal:</Text>
                  <Text>{formatCurrency(calculateSubtotal())}</Text>
                </div>
                <div>
                  <Text fw={500}>Total Discount:</Text>
                  <Text>{formatCurrency(calculateTotalDiscount())}</Text>
                </div>
                <div>
                  <Text fw={500}>Tax:</Text>
                  <Text>{formatCurrency(form.values.tax || 0)}</Text>
                </div>
                <div>
                  <Text fw={500}>Total Amount:</Text>
                  <Text size="lg" fw={700}>
                    {formatCurrency(calculateTotalAmount())}
                  </Text>
                </div>
              </Group>
            </Paper>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={formItems.length === 0}>
              {editMode ? 'Update Sale' : 'Create Sale'}
            </Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
}
