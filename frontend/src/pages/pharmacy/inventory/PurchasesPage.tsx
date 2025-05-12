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
  Alert
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
  IconReceipt
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import config from '../../../config';
import { useAuthStore } from '../../../store/authStore';
import { format } from 'date-fns';
import { formatCurrency } from '../../../utils/currency';

const { API_URL } = config;

interface PurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  batchNumber?: string;
  expiryDate?: string;
}

interface Purchase {
  id: string;
  invoiceNumber: string;
  purchaseDate: string;
  supplierId: string;
  supplierName: string;
  totalAmount: number;
  paymentStatus: 'PAID' | 'UNPAID' | 'PARTIAL';
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: PurchaseItem[];
}

export function PurchasesPage() {
  // Form state for adding items
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemBatch, setItemBatch] = useState<string>('');
  const [itemExpiry, setItemExpiry] = useState<string>('');
  
  // Purchase form
  const form = useForm({
    initialValues: {
      supplierId: '',
      invoiceNumber: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'UNPAID' as 'UNPAID' | 'PAID' | 'PARTIAL',
      paymentMethod: 'CASH',
      totalAmount: 0,
      notes: ''
    },
    validate: {
      supplierId: (value) => (value ? null : 'Supplier is required'),
      invoiceNumber: (value) => (value ? null : 'Invoice number is required'),
      purchaseDate: (value) => (value ? null : 'Purchase date is required'),
      paymentStatus: (value) => (value ? null : 'Payment status is required'),
      paymentMethod: (value) => (value ? null : 'Payment method is required')
    }
  });
  const { token } = useAuthStore();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('purchaseDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [suppliers, setSuppliers] = useState<{value: string, label: string}[]>([]);
  const [products, setProducts] = useState<{value: string, label: string, price: number}[]>([]);
  const [formItems, setFormItems] = useState<{productId: string, productName: string, quantity: number, unitPrice: number, totalPrice: number, batchNumber?: string, expiryDate?: string}[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [currentPurchaseId, setCurrentPurchaseId] = useState<string | null>(null);
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterPurchases();
  }, [searchQuery, paymentStatusFilter, purchases, sortField, sortDirection]);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/purchases`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPurchases(response.data.data.purchases);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch purchases. Please try again.',
        color: 'red',
      });
      setLoading(false);
    }
  };

  const filterPurchases = () => {
    let filtered = [...purchases];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (purchase) =>
          purchase.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          purchase.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply payment status filter
    if (paymentStatusFilter) {
      filtered = filtered.filter((purchase) => purchase.paymentStatus === paymentStatusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const fieldA = a[sortField as keyof Purchase];
      const fieldB = b[sortField as keyof Purchase];
      
      if (fieldA instanceof Date && fieldB instanceof Date) {
        return sortDirection === 'asc' 
          ? fieldA.getTime() - fieldB.getTime() 
          : fieldB.getTime() - fieldA.getTime();
      } else if (typeof fieldA === 'string' && typeof fieldB === 'string') {
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

    setFilteredPurchases(filtered);
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

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${API_URL}/suppliers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const supplierOptions = response.data.data.suppliers.map((supplier: any) => ({
        value: supplier.id,
        label: supplier.name
      }));
      setSuppliers(supplierOptions);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productOptions = response.data.data.products.map((product: any) => ({
        value: product.id,
        label: product.name,
        price: product.costPrice
      }));
      setProducts(productOptions);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  const viewPurchaseDetails = async (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    
    try {
      const response = await axios.get(`${API_URL}/purchases/${purchase.id}/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPurchaseItems(response.data.data.items);
    } catch (error) {
      console.error('Error fetching purchase items:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch purchase items. Please try again.',
        color: 'red',
      });
      setPurchaseItems([]);
    }
    
    openDetails();
  };

  const handleOpenCreateModal = () => {
    setEditMode(false);
    setCurrentPurchaseId(null);
    form.reset();
    form.setValues({
      ...form.values,
      purchaseDate: new Date().toISOString().split('T')[0]
    });
    setFormItems([]);
    openForm();
  };

  const handleEditPurchase = async (purchase: Purchase) => {
    setEditMode(true);
    setCurrentPurchaseId(purchase.id);
    
    form.setValues({
      supplierId: purchase.supplierId,
      invoiceNumber: purchase.invoiceNumber,
      purchaseDate: new Date(purchase.purchaseDate).toISOString().split('T')[0],
      paymentStatus: purchase.paymentStatus,
      paymentMethod: purchase.paymentMethod,
      totalAmount: purchase.totalAmount,
      notes: purchase.notes || ''
    });
    
    try {
      const response = await axios.get(`${API_URL}/purchases/${purchase.id}/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const items = response.data.data.items.map((item: PurchaseItem) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate
      }));
      
      setFormItems(items);
      openForm();
    } catch (error) {
      console.error('Error fetching purchase items for edit:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load purchase details for editing.',
        color: 'red',
      });
    }
  };

  const addItemToForm = () => {
    if (!selectedProduct) {
      notifications.show({
        title: 'Error',
        message: 'Please select a product',
        color: 'red'
      });
      return;
    }

    if (itemQuantity <= 0) {
      notifications.show({
        title: 'Error',
        message: 'Quantity must be greater than zero',
        color: 'red'
      });
      return;
    }

    if (itemPrice <= 0) {
      notifications.show({
        title: 'Error',
        message: 'Price must be greater than zero',
        color: 'red'
      });
      return;
    }

    const selectedProductObj = products.find(p => p.value === selectedProduct);
    if (!selectedProductObj) return;

    const newItem = {
      productId: selectedProduct,
      productName: selectedProductObj.label,
      quantity: itemQuantity,
      unitPrice: itemPrice,
      totalPrice: itemQuantity * itemPrice,
      batchNumber: itemBatch || undefined,
      expiryDate: itemExpiry || undefined
    };

    setFormItems([...formItems, newItem]);
    setSelectedProduct(null);
    setItemQuantity(1);
    setItemPrice(0);
    setItemBatch('');
    setItemExpiry('');
  };

  const removeItemFromForm = (index: number) => {
    const newItems = [...formItems];
    newItems.splice(index, 1);
    setFormItems(newItems);
  };

  const calculateTotalAmount = () => {
    return formItems.reduce((total: number, item) => total + item.totalPrice, 0);
  };

  const handleSubmitPurchase = async (values: typeof form.values) => {
    if (formItems.length === 0) {
      notifications.show({
        title: 'Error',
        message: 'Please add at least one item to the purchase',
        color: 'red',
      });
      return;
    }
    
    const purchaseData = {
      ...values,
      totalAmount: calculateTotalAmount(),
      items: formItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate
      }))
    };
    
    try {
      if (editMode && currentPurchaseId) {
        await axios.patch(`${API_URL}/purchases/${currentPurchaseId}`, purchaseData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({
          title: 'Success',
          message: 'Purchase updated successfully',
          color: 'teal',
        });
      } else {
        await axios.post(`${API_URL}/purchases`, purchaseData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({
          title: 'Success',
          message: 'Purchase created successfully',
          color: 'teal',
        });
      }
      
      closeForm();
      form.reset();
      setFormItems([]);
      fetchPurchases();
    } catch (error) {
      console.error('Error saving purchase:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to save purchase. Please try again.',
        color: 'red',
      });
    }
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setPaymentStatusFilter(null);
    setSortField('purchaseDate');
    setSortDirection('desc');
  };

  const paginatedPurchases = filteredPurchases.slice(
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
        Purchase Management
      </Title>

      <Tabs defaultValue="all">
        <Tabs.List mb="md">
          <Tabs.Tab value="all" leftSection={<IconReceipt size={16} />}>
            All Purchases
          </Tabs.Tab>
          <Tabs.Tab value="unpaid" leftSection={<IconReceipt size={16} />}>
            Unpaid
          </Tabs.Tab>
          <Tabs.Tab value="paid" leftSection={<IconReceipt size={16} />}>
            Paid
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all">
          <Card shadow="sm" p="md" radius="md" mb="md">
            <Group justify="space-between" mb="md">
              <Group>
                <TextInput
                  placeholder="Search purchases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  leftSection={<IconSearch size={16} />}
                />
                <Select
                  placeholder="Filter by payment status"
                  data={[
                    { value: 'PAID', label: 'Paid' },
                    { value: 'UNPAID', label: 'Unpaid' },
                    { value: 'PARTIAL', label: 'Partial' }
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
                New Purchase
              </Button>
            </Group>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Loader />
              </div>
            ) : paginatedPurchases.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No purchases found. Try adjusting your filters or create a new purchase.
              </Text>
            ) : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>
                        <Group gap={5} onClick={() => handleSort('invoiceNumber')} style={{ cursor: 'pointer' }}>
                          Invoice #
                          {sortField === 'invoiceNumber' && (
                            sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                          )}
                        </Group>
                      </Table.Th>
                      <Table.Th>
                        <Group gap={5} onClick={() => handleSort('purchaseDate')} style={{ cursor: 'pointer' }}>
                          Date
                          {sortField === 'purchaseDate' && (
                            sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                          )}
                        </Group>
                      </Table.Th>
                      <Table.Th>
                        <Group gap={5} onClick={() => handleSort('supplierName')} style={{ cursor: 'pointer' }}>
                          Supplier
                          {sortField === 'supplierName' && (
                            sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                          )}
                        </Group>
                      </Table.Th>
                      <Table.Th>
                        <Group gap={5} onClick={() => handleSort('totalAmount')} style={{ cursor: 'pointer' }}>
                          Amount
                          {sortField === 'totalAmount' && (
                            sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                          )}
                        </Group>
                      </Table.Th>
                      <Table.Th>Payment Status</Table.Th>
                      <Table.Th>Payment Method</Table.Th>
                      <Table.Th style={{ width: 80 }}>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedPurchases.map((purchase) => (
                      <Table.Tr key={purchase.id}>
                        <Table.Td>{purchase.invoiceNumber}</Table.Td>
                        <Table.Td>{format(new Date(purchase.purchaseDate), 'MMM dd, yyyy')}</Table.Td>
                        <Table.Td>{purchase.supplierName}</Table.Td>
                        <Table.Td>{formatCurrency(purchase.totalAmount)}</Table.Td>
                        <Table.Td>{renderPaymentStatus(purchase.paymentStatus)}</Table.Td>
                        <Table.Td>{purchase.paymentMethod}</Table.Td>
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
                                onClick={() => viewPurchaseDetails(purchase)}
                              >
                                View Details
                              </Menu.Item>
                              <Menu.Item 
                                leftSection={<IconEdit size={16} />}
                                onClick={() => handleEditPurchase(purchase)}
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

        <Tabs.Panel value="unpaid">
          <Card shadow="sm" p="md" radius="md" mb="md">
            <Title order={4} mb="md">Unpaid Purchases</Title>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Loader />
              </div>
            ) : purchases.filter(p => p.paymentStatus === 'UNPAID').length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No unpaid purchases found.
              </Text>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Invoice #</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Supplier</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {purchases
                    .filter(p => p.paymentStatus === 'UNPAID')
                    .map((purchase) => (
                      <Table.Tr key={purchase.id}>
                        <Table.Td>{purchase.invoiceNumber}</Table.Td>
                        <Table.Td>{format(new Date(purchase.purchaseDate), 'MMM dd, yyyy')}</Table.Td>
                        <Table.Td>{purchase.supplierName}</Table.Td>
                        <Table.Td>{formatCurrency(purchase.totalAmount)}</Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Button size="xs" variant="outline" onClick={() => viewPurchaseDetails(purchase)}>
                              View
                            </Button>
                            <Button size="xs" variant="filled" color="green">
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

        <Tabs.Panel value="paid">
          <Card shadow="sm" p="md" radius="md" mb="md">
            <Title order={4} mb="md">Paid Purchases</Title>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Loader />
              </div>
            ) : purchases.filter(p => p.paymentStatus === 'PAID').length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No paid purchases found.
              </Text>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Invoice #</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Supplier</Table.Th>
                    <Table.Th>Amount</Table.Th>
                    <Table.Th>Payment Method</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {purchases
                    .filter(p => p.paymentStatus === 'PAID')
                    .map((purchase) => (
                      <Table.Tr key={purchase.id}>
                        <Table.Td>{purchase.invoiceNumber}</Table.Td>
                        <Table.Td>{format(new Date(purchase.purchaseDate), 'MMM dd, yyyy')}</Table.Td>
                        <Table.Td>{purchase.supplierName}</Table.Td>
                        <Table.Td>{formatCurrency(purchase.totalAmount)}</Table.Td>
                        <Table.Td>{purchase.paymentMethod}</Table.Td>
                        <Table.Td>
                          <Button size="xs" variant="outline" onClick={() => viewPurchaseDetails(purchase)}>
                            View
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                </Table.Tbody>
              </Table>
            )}
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Purchase details modal */}
      <Modal
        opened={detailsOpened}
        onClose={closeDetails}
        title={`Purchase Details - ${selectedPurchase?.invoiceNumber || ''}`}
        size="lg"
      >
        {selectedPurchase && (
          <>
            <Grid>
              <Grid.Col span={6}>
                <Text fw={500}>Supplier:</Text>
                <Text>{selectedPurchase.supplierName}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fw={500}>Date:</Text>
                <Text>{format(new Date(selectedPurchase.purchaseDate), 'MMMM dd, yyyy')}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fw={500}>Payment Status:</Text>
                <Text>{renderPaymentStatus(selectedPurchase.paymentStatus)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fw={500}>Payment Method:</Text>
                <Text>{selectedPurchase.paymentMethod}</Text>
              </Grid.Col>
              {selectedPurchase.notes && (
                <Grid.Col span={12}>
                  <Text fw={500}>Notes:</Text>
                  <Text>{selectedPurchase.notes}</Text>
                </Grid.Col>
              )}
            </Grid>

            <Divider my="md" />

            <Text fw={500} mb="xs">Purchase Items:</Text>
            {purchaseItems.length === 0 ? (
              <Text c="dimmed">No items found for this purchase.</Text>
            ) : (
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Unit Price</Table.Th>
                    <Table.Th>Total</Table.Th>
                    <Table.Th>Batch #</Table.Th>
                    <Table.Th>Expiry Date</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {purchaseItems.map((item) => (
                    <Table.Tr key={item.id}>
                      <Table.Td>{item.productName}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>{formatCurrency(item.unitPrice)}</Table.Td>
                      <Table.Td>{formatCurrency(item.totalPrice)}</Table.Td>
                      <Table.Td>{item.batchNumber || '-'}</Table.Td>
                      <Table.Td>
                        {item.expiryDate 
                          ? format(new Date(item.expiryDate), 'MMM dd, yyyy')
                          : '-'
                        }
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}

            <Divider my="md" />

            <Group justify="space-between">
              <div>
                <Text fw={500}>Total Amount:</Text>
                <Text size="lg" fw={700}>{formatCurrency(selectedPurchase.totalAmount)}</Text>
              </div>
              <Button 
                variant="outline" 
                onClick={closeDetails}
              >
                Close
              </Button>
            </Group>
          </>
        )}
      </Modal>
      
      {/* Purchase form modal */}
      <Modal
        opened={formOpened}
        onClose={() => {
          closeForm();
          form.reset();
          setFormItems([]);
        }}
        title={editMode ? "Edit Purchase" : "Create New Purchase"}
        size="xl"
      >
        <form onSubmit={form.onSubmit(handleSubmitPurchase)}>
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Supplier"
                placeholder="Select supplier"
                data={suppliers}
                required
                searchable
                {...form.getInputProps('supplierId')}
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
                label="Purchase Date"
                placeholder="YYYY-MM-DD"
                required
                {...form.getInputProps('purchaseDate')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Payment Status"
                placeholder="Select payment status"
                data={[
                  { value: 'PAID', label: 'Paid' },
                  { value: 'UNPAID', label: 'Unpaid' },
                  { value: 'PARTIAL', label: 'Partial' }
                ]}
                required
                {...form.getInputProps('paymentStatus')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Payment Method"
                placeholder="Select payment method"
                data={[
                  { value: 'CASH', label: 'Cash' },
                  { value: 'CARD', label: 'Card' },
                  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                  { value: 'CHECK', label: 'Check' },
                  { value: 'CREDIT', label: 'Credit' }
                ]}
                required
                {...form.getInputProps('paymentMethod')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Total Amount"
                placeholder="0.00"
                min={0}
                required
                readOnly
                value={calculateTotalAmount()}
                {...form.getInputProps('totalAmount')}
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

          <Title order={4} mt="md" mb="sm">Purchase Items</Title>
          
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
              onChange={(val) => setItemQuantity(typeof val === 'number' ? val : 1)}
              style={{ width: '100px' }}
            />
            <NumberInput
              placeholder="Unit Price"
              min={0}
              value={itemPrice}
              onChange={(val) => setItemPrice(typeof val === 'number' ? val : 0)}
              style={{ width: '120px' }}
            />
            <TextInput
              placeholder="Batch Number"
              value={itemBatch}
              onChange={(e) => setItemBatch(e.currentTarget.value)}
              style={{ width: '120px' }}
            />
            <TextInput
              placeholder="Expiry Date (YYYY-MM-DD)"
              value={itemExpiry}
              onChange={(e) => setItemExpiry(e.currentTarget.value)}
              style={{ width: '180px' }}
            />
            <Button onClick={addItemToForm}>Add Item</Button>
          </Group>

          {formItems.length === 0 ? (
            <Alert color="blue" title="No items added">
              Please add at least one item to this purchase.
            </Alert>
          ) : (
            <Paper withBorder p="md" mb="md">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Unit Price</Table.Th>
                    <Table.Th>Total</Table.Th>
                    <Table.Th>Batch #</Table.Th>
                    <Table.Th>Expiry</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {formItems.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{item.productName}</Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>{formatCurrency(item.unitPrice)}</Table.Td>
                      <Table.Td>{formatCurrency(item.totalPrice)}</Table.Td>
                      <Table.Td>{item.batchNumber || '-'}</Table.Td>
                      <Table.Td>{item.expiryDate || '-'}</Table.Td>
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
            </Paper>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeForm}>Cancel</Button>
            <Button type="submit" disabled={formItems.length === 0}>
              {editMode ? 'Update Purchase' : 'Create Purchase'}
            </Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
}
