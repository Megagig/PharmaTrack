import { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  Table,
  Button,
  Group,
  TextInput,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  Badge,
  Box,
  Tabs,
  Alert,
  Loader,
  ActionIcon,
  Menu,
  Tooltip,
  Grid,
  Card,
  Progress,
  Container,
  Divider,
  SimpleGrid,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useAuthStore } from '../../../store/authStore';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconAlertTriangle,
  IconPackage,
  IconCalendarTime,
  IconFilter,
  IconRefresh,
  IconArrowUp,
  IconArrowDown,
  IconDotsVertical,
  IconDownload,
  IconAdjustments,
  IconBarcode,
  IconTruckDelivery,
  IconShoppingCart,
} from '@tabler/icons-react';

// Define types
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  costPrice: number;
  retailPrice: number;
  expiryDate?: Date | null;
  description?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
}

interface BatchItem {
  id: string;
  batchNumber: string;
  expiryDate: Date;
  initialQuantity: number;
  currentQuantity: number;
  productId: string;
}

interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  description?: string;
  dosageForm?: string;
  strength?: string;
  costPrice: number;
  wholesalePrice: number;
  retailPrice: number;
  reorderLevel: number;
  manufacturer?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function StockManagement() {
  const { token } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    category: '',
    costPrice: 0,
    wholesalePrice: 0,
    retailPrice: 0,
    reorderLevel: 10,
  });
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);

  // Helper function to get badge color based on status
  const getStatusColor = (product: Product) => {
    if (product.currentStock === 0) {
      return 'red';
    } else if (product.currentStock <= product.reorderLevel) {
      return 'orange';
    } else {
      return 'green';
    }
  };

  // Helper function to get status text
  const getStatusText = (product: Product) => {
    if (product.currentStock === 0) {
      return 'Out of Stock';
    } else if (product.currentStock <= product.reorderLevel) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data && response.data.data.products) {
        setProducts(response.data.data.products);
        setFilteredProducts(response.data.data.products);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(
            response.data.data.products.map((p: Product) => p.category)
          ),
        ];
        setCategories(uniqueCategories);

        // Set low stock products
        const lowStock = response.data.data.products.filter(
          (p: Product) => p.currentStock > 0 && p.currentStock <= p.reorderLevel
        );
        setLowStockProducts(lowStock);

        // Fetch expiring products
        fetchExpiringProducts();
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch products. Using mock data for demonstration.',
        color: 'yellow',
      });

      // Set mock data for demonstration
      const mockData = getMockProducts();
      setProducts(mockData);
      setFilteredProducts(mockData);
      setCategories([...new Set(mockData.map((p) => p.category))]);
      setLowStockProducts(
        mockData.filter(
          (p) => p.currentStock > 0 && p.currentStock <= p.reorderLevel
        )
      );
      setExpiringProducts(
        mockData.filter(
          (p) =>
            p.expiryDate &&
            new Date(p.expiryDate) <
              new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch expiring products
  const fetchExpiringProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/expiring?days=90`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data && response.data.data.products) {
        setExpiringProducts(response.data.data.products);
      }
    } catch (error) {
      console.error('Error fetching expiring products:', error);
      // Set mock expiring products
      const mockData = getMockProducts();
      setExpiringProducts(
        mockData.filter(
          (p) =>
            p.expiryDate &&
            new Date(p.expiryDate) <
              new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        )
      );
    }
  };

  // Fetch batch items for a product
  const fetchBatchItems = async (productId: string) => {
    try {
      setLoadingBatches(true);
      const response = await axios.get(
        `${API_URL}/products/${productId}/batches`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.data &&
        response.data.data &&
        response.data.data.batchItems
      ) {
        setBatchItems(response.data.data.batchItems);
      }
    } catch (error) {
      console.error('Error fetching batch items:', error);
      // Set mock batch items
      setBatchItems([
        {
          id: '1',
          batchNumber: 'B001',
          expiryDate: new Date('2024-06-15'),
          initialQuantity: 100,
          currentQuantity: 75,
          productId,
        },
        {
          id: '2',
          batchNumber: 'B002',
          expiryDate: new Date('2024-08-20'),
          initialQuantity: 200,
          currentQuantity: 175,
          productId,
        },
      ]);
    } finally {
      setLoadingBatches(false);
    }
  };

  // Open update modal
  const openUpdateModal = (id: string) => {
    setSelectedProductId(id);
    const product = products.find((p) => p.id === id);
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        description: product.description || '',
        dosageForm: product.dosageForm || '',
        strength: product.strength || '',
        costPrice: product.costPrice,
        wholesalePrice: product.costPrice * 1.1, // Assuming 10% markup
        retailPrice: product.retailPrice,
        reorderLevel: product.reorderLevel,
        manufacturer: product.manufacturer || '',
      });
      fetchBatchItems(id);
    }
    setUpdateModalOpen(true);
  };

  // Handle update product
  const handleUpdateProduct = async () => {
    try {
      if (!selectedProductId) return;

      const response = await axios.put(
        `${API_URL}/products/${selectedProductId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data && response.data.data.product) {
        // Update products list
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === selectedProductId ? response.data.data.product : p
          )
        );

        notifications.show({
          title: 'Success',
          message: 'Product updated successfully',
          color: 'green',
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update product. Please try again.',
        color: 'red',
      });
    } finally {
      setUpdateModalOpen(false);
      setSelectedProductId(null);
    }
  };

  // Handle add product
  const handleAddProduct = async () => {
    try {
      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data && response.data.data.product) {
        // Add new product to list
        setProducts((prevProducts) => [
          ...prevProducts,
          response.data.data.product,
        ]);

        notifications.show({
          title: 'Success',
          message: 'Product added successfully',
          color: 'green',
        });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to add product. Please try again.',
        color: 'red',
      });
    } finally {
      setAddModalOpen(false);
      // Reset form data
      setFormData({
        name: '',
        sku: '',
        category: '',
        costPrice: 0,
        wholesalePrice: 0,
        retailPrice: 0,
        reorderLevel: 10,
      });
    }
  };

  // Handle form input change
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-calculate wholesale and retail prices when cost price changes
    if (field === 'costPrice') {
      const costPrice = Number(value);
      setFormData((prev) => ({
        ...prev,
        wholesalePrice: costPrice * 1.1, // 10% markup
        retailPrice: costPrice * 1.25, // 25% markup
      }));
    }
  };

  // Handle search and filtering
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply tab filter
    if (activeTab === 'low-stock') {
      filtered = filtered.filter(
        (product) =>
          product.currentStock > 0 &&
          product.currentStock <= product.reorderLevel
      );
    } else if (activeTab === 'out-of-stock') {
      filtered = filtered.filter((product) => product.currentStock === 0);
    } else if (activeTab === 'expiring') {
      const expiringIds = expiringProducts.map((p) => p.id);
      filtered = filtered.filter((product) => expiringIds.includes(product.id));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (sortField === 'currentStock') {
        comparison = a.currentStock - b.currentStock;
      } else if (sortField === 'retailPrice') {
        comparison = a.retailPrice - b.retailPrice;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredProducts(filtered);
  }, [
    products,
    searchQuery,
    selectedCategory,
    activeTab,
    sortField,
    sortDirection,
    expiringProducts,
  ]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Mock data for demonstration
  const getMockProducts = (): Product[] => {
    return [
      {
        id: '1',
        name: 'Paracetamol 500mg',
        sku: 'PCM500',
        category: 'Analgesic',
        currentStock: 250,
        reorderLevel: 50,
        costPrice: 200,
        retailPrice: 250,
        expiryDate: new Date('2024-06-15'),
        description: 'Pain reliever and fever reducer',
        dosageForm: 'Tablet',
        strength: '500mg',
        manufacturer: 'GSK',
      },
      {
        id: '2',
        name: 'Amoxicillin 250mg',
        sku: 'AMX250',
        category: 'Antibiotic',
        currentStock: 120,
        reorderLevel: 30,
        costPrice: 350,
        retailPrice: 450,
        expiryDate: new Date('2024-03-20'),
        dosageForm: 'Capsule',
        strength: '250mg',
      },
      {
        id: '3',
        name: 'Metformin 500mg',
        sku: 'MET500',
        category: 'Antidiabetic',
        currentStock: 180,
        reorderLevel: 40,
        costPrice: 300,
        retailPrice: 380,
        expiryDate: new Date('2024-08-10'),
      },
      {
        id: '4',
        name: 'Lisinopril 10mg',
        sku: 'LIS10',
        category: 'Antihypertensive',
        currentStock: 20,
        reorderLevel: 25,
        costPrice: 400,
        retailPrice: 500,
        expiryDate: new Date('2024-05-05'),
      },
      {
        id: '5',
        name: 'Salbutamol Inhaler',
        sku: 'SAL100',
        category: 'Bronchodilator',
        currentStock: 15,
        reorderLevel: 20,
        costPrice: 1200,
        retailPrice: 1500,
        expiryDate: new Date('2024-07-22'),
      },
      {
        id: '6',
        name: 'Ciprofloxacin 500mg',
        sku: 'CIP500',
        category: 'Antibiotic',
        currentStock: 0,
        reorderLevel: 30,
        costPrice: 450,
        retailPrice: 550,
        expiryDate: new Date('2024-04-18'),
      },
    ];
  };
  return (
    <Container size="xl" p="md">
      <Paper shadow="xs" p="md" withBorder>
        <Group position="apart" mb="md">
          <Title order={2}>Inventory Management</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setAddModalOpen(true)}
            color="green"
          >
            Add Product
          </Button>
        </Group>

        {/* Dashboard Cards */}
        <SimpleGrid
          cols={4}
          spacing="md"
          mb="md"
          breakpoints={[
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'sm', cols: 1 },
          ]}
        >
          <Card shadow="sm" p="md" radius="md" withBorder>
            <Group position="apart">
              <Text weight={500}>Total Products</Text>
              <IconPackage size={24} color="blue" />
            </Group>
            <Text size="xl" weight={700} mt="md">
              {products.length}
            </Text>
          </Card>

          <Card shadow="sm" p="md" radius="md" withBorder>
            <Group position="apart">
              <Text weight={500}>Low Stock</Text>
              <IconAlertTriangle size={24} color="orange" />
            </Group>
            <Text size="xl" weight={700} mt="md">
              {lowStockProducts.length}
            </Text>
            <Progress
              value={(lowStockProducts.length / products.length) * 100}
              color="orange"
              size="sm"
              mt="md"
            />
          </Card>

          <Card shadow="sm" p="md" radius="md" withBorder>
            <Group position="apart">
              <Text weight={500}>Out of Stock</Text>
              <IconAlertTriangle size={24} color="red" />
            </Group>
            <Text size="xl" weight={700} mt="md">
              {products.filter((p) => p.currentStock === 0).length}
            </Text>
            <Progress
              value={
                (products.filter((p) => p.currentStock === 0).length /
                  products.length) *
                100
              }
              color="red"
              size="sm"
              mt="md"
            />
          </Card>

          <Card shadow="sm" p="md" radius="md" withBorder>
            <Group position="apart">
              <Text weight={500}>Expiring Soon</Text>
              <IconCalendarTime size={24} color="grape" />
            </Group>
            <Text size="xl" weight={700} mt="md">
              {expiringProducts.length}
            </Text>
            <Text size="xs" color="dimmed" mt={5}>
              Within 90 days
            </Text>
          </Card>
        </SimpleGrid>

        {/* Tabs and Filters */}
        <Tabs value={activeTab} onTabChange={setActiveTab} mb="md">
          <Tabs.List>
            <Tabs.Tab value="all" icon={<IconPackage size={14} />}>
              All Products
            </Tabs.Tab>
            <Tabs.Tab
              value="low-stock"
              icon={<IconAlertTriangle size={14} />}
              color="orange"
            >
              Low Stock ({lowStockProducts.length})
            </Tabs.Tab>
            <Tabs.Tab
              value="out-of-stock"
              icon={<IconAlertTriangle size={14} />}
              color="red"
            >
              Out of Stock (
              {products.filter((p) => p.currentStock === 0).length})
            </Tabs.Tab>
            <Tabs.Tab
              value="expiring"
              icon={<IconCalendarTime size={14} />}
              color="grape"
            >
              Expiring Soon ({expiringProducts.length})
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {/* Search and Filters */}
        <Group position="apart" mb="md">
          <Group>
            <TextInput
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<IconSearch size={14} />}
              style={{ width: 250 }}
            />

            <Select
              placeholder="Filter by category"
              value={selectedCategory}
              onChange={setSelectedCategory}
              data={[
                { value: '', label: 'All Categories' },
                ...categories.map((cat) => ({ value: cat, label: cat })),
              ]}
              icon={<IconFilter size={14} />}
              clearable
              style={{ width: 200 }}
            />
          </Group>

          <Group>
            <Button
              variant="outline"
              leftIcon={<IconRefresh size={14} />}
              onClick={fetchProducts}
            >
              Refresh
            </Button>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="outline" leftIcon={<IconDownload size={14} />}>
                  Export
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item>Export as CSV</Menu.Item>
                <Menu.Item>Export as PDF</Menu.Item>
                <Menu.Item>Print Inventory</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>

        {/* Products Table */}
        {loading ? (
          <Box py="xl" style={{ display: 'flex', justifyContent: 'center' }}>
            <Loader size="lg" />
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Alert color="blue" title="No products found">
            {searchQuery
              ? `No products match your search criteria "${searchQuery}".`
              : activeTab !== 'all'
              ? `No products in the ${activeTab} category.`
              : 'No products in inventory. Add some products to get started.'}
          </Alert>
        ) : (
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('name')}
                >
                  <Group spacing={5}>
                    Product Name
                    {sortField === 'name' &&
                      (sortDirection === 'asc' ? (
                        <IconArrowUp size={14} />
                      ) : (
                        <IconArrowDown size={14} />
                      ))}
                  </Group>
                </th>
                <th>SKU</th>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('category')}
                >
                  <Group spacing={5}>
                    Category
                    {sortField === 'category' &&
                      (sortDirection === 'asc' ? (
                        <IconArrowUp size={14} />
                      ) : (
                        <IconArrowDown size={14} />
                      ))}
                  </Group>
                </th>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('currentStock')}
                >
                  <Group spacing={5}>
                    Stock
                    {sortField === 'currentStock' &&
                      (sortDirection === 'asc' ? (
                        <IconArrowUp size={14} />
                      ) : (
                        <IconArrowDown size={14} />
                      ))}
                  </Group>
                </th>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('retailPrice')}
                >
                  <Group spacing={5}>
                    Price
                    {sortField === 'retailPrice' &&
                      (sortDirection === 'asc' ? (
                        <IconArrowUp size={14} />
                      ) : (
                        <IconArrowDown size={14} />
                      ))}
                  </Group>
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Group spacing="sm">
                      <Text weight={500}>{product.name}</Text>
                      {product.expiryDate &&
                        new Date(product.expiryDate) <
                          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                          <Tooltip
                            label={`Expires on ${formatDate(
                              product.expiryDate
                            )}`}
                          >
                            <IconCalendarTime size={16} color="red" />
                          </Tooltip>
                        )}
                    </Group>
                    {product.description && (
                      <Text size="xs" color="dimmed">
                        {product.description}
                      </Text>
                    )}
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td>
                    <Group spacing={5}>
                      <Text>{product.currentStock}</Text>
                      {product.currentStock <= product.reorderLevel && (
                        <Tooltip
                          label={`Reorder Level: ${product.reorderLevel}`}
                        >
                          <IconAlertTriangle
                            size={16}
                            color={
                              product.currentStock === 0 ? 'red' : 'orange'
                            }
                          />
                        </Tooltip>
                      )}
                    </Group>
                  </td>
                  <td>{formatCurrency(product.retailPrice)}</td>
                  <td>
                    <Badge color={getStatusColor(product)}>
                      {getStatusText(product)}
                    </Badge>
                  </td>
                  <td>
                    <Group spacing={5}>
                      <ActionIcon
                        color="blue"
                        onClick={() => openUpdateModal(product.id)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon>
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item icon={<IconBarcode size={14} />}>
                            View Details
                          </Menu.Item>
                          <Menu.Item icon={<IconAdjustments size={14} />}>
                            Adjust Stock
                          </Menu.Item>
                          <Menu.Item icon={<IconTruckDelivery size={14} />}>
                            Create Purchase
                          </Menu.Item>
                          <Menu.Item icon={<IconShoppingCart size={14} />}>
                            Sell Product
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item icon={<IconTrash size={14} />} color="red">
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Paper>

      {/* Add Product Modal */}
      <Modal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Product"
        size="lg"
      >
        <Stack spacing="md">
          <TextInput
            label="Product Name"
            placeholder="Enter product name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="SKU"
                placeholder="Enter SKU"
                required
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Category"
                placeholder="Enter category"
                required
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                list="categories"
              />
              <datalist id="categories">
                {categories.map((cat, index) => (
                  <option key={index} value={cat} />
                ))}
              </datalist>
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Dosage Form"
                placeholder="e.g., Tablet, Capsule, Syrup"
                value={formData.dosageForm || ''}
                onChange={(e) =>
                  handleInputChange('dosageForm', e.target.value)
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Strength"
                placeholder="e.g., 500mg, 5ml"
                value={formData.strength || ''}
                onChange={(e) => handleInputChange('strength', e.target.value)}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={4}>
              <NumberInput
                label="Cost Price"
                placeholder="Enter cost price"
                required
                min={0}
                precision={2}
                value={formData.costPrice}
                onChange={(val) => handleInputChange('costPrice', val)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Wholesale Price"
                placeholder="Enter wholesale price"
                required
                min={0}
                precision={2}
                value={formData.wholesalePrice}
                onChange={(val) => handleInputChange('wholesalePrice', val)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Retail Price"
                placeholder="Enter retail price"
                required
                min={0}
                precision={2}
                value={formData.retailPrice}
                onChange={(val) => handleInputChange('retailPrice', val)}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Reorder Level"
                placeholder="Enter reorder level"
                required
                min={0}
                value={formData.reorderLevel}
                onChange={(val) => handleInputChange('reorderLevel', val)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Manufacturer"
                placeholder="Enter manufacturer"
                value={formData.manufacturer || ''}
                onChange={(e) =>
                  handleInputChange('manufacturer', e.target.value)
                }
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label="Description"
            placeholder="Enter product description"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />

          <Group position="right" mt="md">
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Update Product Modal */}
      <Modal
        opened={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        title="Update Product"
        size="lg"
      >
        <Tabs defaultValue="details">
          <Tabs.List>
            <Tabs.Tab value="details" icon={<IconBarcode size={14} />}>
              Product Details
            </Tabs.Tab>
            <Tabs.Tab value="batches" icon={<IconPackage size={14} />}>
              Batch Information
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="details" pt="xs">
            <Stack spacing="md" mt="md">
              <TextInput
                label="Product Name"
                placeholder="Enter product name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="SKU"
                    placeholder="Enter SKU"
                    required
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    disabled
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Category"
                    placeholder="Enter category"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange('category', e.target.value)
                    }
                    list="update-categories"
                  />
                  <datalist id="update-categories">
                    {categories.map((cat, index) => (
                      <option key={index} value={cat} />
                    ))}
                  </datalist>
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Dosage Form"
                    placeholder="e.g., Tablet, Capsule, Syrup"
                    value={formData.dosageForm || ''}
                    onChange={(e) =>
                      handleInputChange('dosageForm', e.target.value)
                    }
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Strength"
                    placeholder="e.g., 500mg, 5ml"
                    value={formData.strength || ''}
                    onChange={(e) =>
                      handleInputChange('strength', e.target.value)
                    }
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Cost Price"
                    placeholder="Enter cost price"
                    required
                    min={0}
                    precision={2}
                    value={formData.costPrice}
                    onChange={(val) => handleInputChange('costPrice', val)}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Wholesale Price"
                    placeholder="Enter wholesale price"
                    required
                    min={0}
                    precision={2}
                    value={formData.wholesalePrice}
                    onChange={(val) => handleInputChange('wholesalePrice', val)}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Retail Price"
                    placeholder="Enter retail price"
                    required
                    min={0}
                    precision={2}
                    value={formData.retailPrice}
                    onChange={(val) => handleInputChange('retailPrice', val)}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Reorder Level"
                    placeholder="Enter reorder level"
                    required
                    min={0}
                    value={formData.reorderLevel}
                    onChange={(val) => handleInputChange('reorderLevel', val)}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Manufacturer"
                    placeholder="Enter manufacturer"
                    value={formData.manufacturer || ''}
                    onChange={(e) =>
                      handleInputChange('manufacturer', e.target.value)
                    }
                  />
                </Grid.Col>
              </Grid>

              <Textarea
                label="Description"
                placeholder="Enter product description"
                value={formData.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
              />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="batches" pt="xs">
            {loadingBatches ? (
              <Box
                py="xl"
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Loader size="md" />
              </Box>
            ) : batchItems.length === 0 ? (
              <Alert color="blue" title="No batch information" mt="md">
                This product has no batch information recorded.
              </Alert>
            ) : (
              <Table striped mt="md">
                <thead>
                  <tr>
                    <th>Batch Number</th>
                    <th>Expiry Date</th>
                    <th>Initial Quantity</th>
                    <th>Current Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {batchItems.map((batch) => (
                    <tr key={batch.id}>
                      <td>{batch.batchNumber}</td>
                      <td>{formatDate(batch.expiryDate)}</td>
                      <td>{batch.initialQuantity}</td>
                      <td>{batch.currentQuantity}</td>
                      <td>
                        <Badge
                          color={
                            new Date(batch.expiryDate) < new Date()
                              ? 'red'
                              : new Date(batch.expiryDate) <
                                new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                              ? 'orange'
                              : 'green'
                          }
                        >
                          {new Date(batch.expiryDate) < new Date()
                            ? 'Expired'
                            : new Date(batch.expiryDate) <
                              new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                            ? 'Expiring Soon'
                            : 'Valid'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tabs.Panel>
        </Tabs>

        <Group position="right" mt="xl">
          <Button variant="outline" onClick={() => setUpdateModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateProduct}>Update Product</Button>
        </Group>
      </Modal>
    </Container>
  );
}
