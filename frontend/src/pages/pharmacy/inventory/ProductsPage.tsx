import { useState, useEffect } from 'react';
import { 
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
  NumberInput, 
  Textarea, 
  Alert
} from '@mantine/core';
import { 
  IconPlus, 
  IconSearch, 
  IconDotsVertical, 
  IconEdit, 
  IconTrash, 
  IconFilter,
  IconPackage,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconArrowsSort,
  IconSortAscending,
  IconSortDescending,
  IconRefresh
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { API_URL } from '../../../config';
import { useAuthStore } from '../../../store/authStore';
import { formatCurrency } from '../../../utils/currency';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  wholesalePrice: number;
  retailPrice: number;
  currentStock: number;
  reorderLevel: number;
  expiryDate?: string;
  description?: string;
  dosageForm?: string;
  strength?: string;
  manufacturer?: string;
  barcode?: string;
}

export function ProductsPage() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<any[]>([]);
  
  const [opened, { open, close }] = useDisclosure(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  const ITEMS_PER_PAGE = 10;

  const form = useForm({
    initialValues: {
      name: '',
      sku: '',
      description: '',
      category: '',
      dosageForm: '',
      strength: '',
      costPrice: 0,
      wholesalePrice: 0,
      retailPrice: 0,
      reorderLevel: 10,
      currentStock: 0,
      manufacturer: '',
      barcode: '',
      expiryDate: ''
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
      sku: (value) => (value.trim().length > 0 ? null : 'SKU is required'),
      category: (value) => (value.trim().length > 0 ? null : 'Category is required'),
      costPrice: (value) => (value > 0 ? null : 'Cost price must be greater than 0'),
      retailPrice: (value) => (value > 0 ? null : 'Retail price must be greater than 0'),
      reorderLevel: (value) => (value >= 0 ? null : 'Reorder level must be non-negative'),
    },
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchLowStockProducts();
    fetchExpiringProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products, sortField, sortDirection]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch products. Please try again.',
        color: 'red',
      });
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/low-stock`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLowStockProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    }
  };

  const fetchExpiringProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/expiring`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpiringProducts(response.data.data.products);
    } catch (error) {
      console.error('Error fetching expiring products:', error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.manufacturer && product.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const fieldA = a[sortField as keyof Product];
      const fieldB = b[sortField as keyof Product];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
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

    setFilteredProducts(filtered);
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

  const handleCreateProduct = async (values: typeof form.values) => {
    try {
      if (editMode && currentProductId) {
        await axios.patch(`${API_URL}/products/${currentProductId}`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({
          title: 'Success',
          message: 'Product updated successfully',
          color: 'teal',
        });
      } else {
        await axios.post(`${API_URL}/products`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({
          title: 'Success',
          message: 'Product created successfully',
          color: 'teal',
        });
      }
      close();
      form.reset();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to save product. Please try again.',
        color: 'red',
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditMode(true);
    setCurrentProductId(product.id);
    form.setValues({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      category: product.category,
      dosageForm: product.dosageForm || '',
      strength: product.strength || '',
      costPrice: product.costPrice,
      wholesalePrice: product.wholesalePrice,
      retailPrice: product.retailPrice,
      reorderLevel: product.reorderLevel,
      currentStock: product.currentStock,
      manufacturer: product.manufacturer || '',
      barcode: product.barcode || '',
      expiryDate: product.expiryDate || '',
    });
    open();
  };

  const handleOpenCreateModal = () => {
    setEditMode(false);
    setCurrentProductId(null);
    form.reset();
    open();
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await axios.delete(`${API_URL}/products/${productToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notifications.show({
        title: 'Success',
        message: 'Product deleted successfully',
        color: 'teal',
      });
      setDeleteModalOpened(false);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete product. It may be referenced by purchases or sales.',
        color: 'red',
      });
    }
  };

  const openDeleteModal = (id: string) => {
    setProductToDelete(id);
    setDeleteModalOpened(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortField('name');
    setSortDirection('asc');
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderStockStatus = (product: Product) => {
    if (product.currentStock === 0) {
      return <Badge color="red">Out of Stock</Badge>;
    } else if (product.currentStock <= product.reorderLevel) {
      return <Badge color="orange">Low Stock</Badge>;
    } else {
      return <Badge color="green">In Stock</Badge>;
    }
  };

  return (
    <Container size="xl" px="xs">
      <Title order={2} mb="md">
        Product Management
      </Title>

      <Tabs defaultValue="all">
        <Tabs.List mb="md">
          <Tabs.Tab value="all" leftSection={<IconPackage size={16} />}>
            All Products
          </Tabs.Tab>
          <Tabs.Tab 
            value="low-stock" 
            leftSection={<IconAlertTriangle size={16} />}
            rightSection={
              <Badge size="xs" variant="filled" color="orange">
                {lowStockProducts.length}
              </Badge>
            }
          >
            Low Stock
          </Tabs.Tab>
          <Tabs.Tab 
            value="expiring" 
            leftSection={<IconAlertTriangle size={16} />}
            rightSection={
              <Badge size="xs" variant="filled" color="red">
                {expiringProducts.length}
              </Badge>
            }
          >
            Expiring Soon
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all">
          <Card shadow="sm" p="md" radius="md" mb="md">
            <Group justify="space-between" mb="md">
              <Group>
                <TextInput
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  leftSection={<IconSearch size={16} />}
                />
                <Select
                  placeholder="Filter by category"
                  data={categories.map((cat) => ({ value: cat, label: cat }))}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
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
                Add Product
              </Button>
            </Group>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Loader />
              </div>
            ) : paginatedProducts.length === 0 ? (
              <Alert title="No products found" color="gray">
                No products match your current filters. Try adjusting your search criteria or add a new product.
              </Alert>
            ) : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>
                        <Group gap={5} onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                          Name
                          {sortField === 'name' && (
                            sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                          )}
                        </Group>
                      </Table.Th>
                      <Table.Th>
                        <Group gap={5} onClick={() => handleSort('sku')} style={{ cursor: 'pointer' }}>
                          SKU
                          {sortField === 'sku' && (
                            sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                          )}
                        </Group>
                      </Table.Th>
                      <Table.Th>
                        <Group gap={5} onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                          Category
                          {sortField === 'category' && (
                            sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                          )}
                        </Group>
                      </Table.Th>
                      <Table.Th>
                        <Group gap={5} onClick={() => handleSort('retailPrice')} style={{ cursor: 'pointer' }}>
                          Retail Price
                          {sortField === 'retailPrice' && (
                            sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                          )}
                        </Group>
                      </Table.Th>
                      <Table.Th>
                        <Group gap={5} onClick={() => handleSort('currentStock')} style={{ cursor: 'pointer' }}>
                          Stock
                          {sortField === 'currentStock' && (
                            sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                          )}
                        </Group>
                      </Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th style={{ width: 80 }}>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedProducts.map((product) => (
                      <Table.Tr key={product.id}>
                        <Table.Td>{product.name}</Table.Td>
                        <Table.Td>{product.sku}</Table.Td>
                        <Table.Td>{product.category}</Table.Td>
                        <Table.Td>{formatCurrency(product.retailPrice)}</Table.Td>
                        <Table.Td>{product.currentStock}</Table.Td>
                        <Table.Td>{renderStockStatus(product)}</Table.Td>
                        <Table.Td>
                          <Menu position="bottom-end" withArrow>
                            <Menu.Target>
                              <ActionIcon variant="subtle">
                                <IconDotsVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item 
                                leftSection={<IconEdit size={16} />}
                                onClick={() => handleEditProduct(product)}
                              >
                                Edit
                              </Menu.Item>
                              <Menu.Item 
                                leftSection={<IconTrash size={16} />}
                                color="red"
                                onClick={() => openDeleteModal(product.id)}
                              >
                                Delete
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

        <Tabs.Panel value="low-stock">
          <Card shadow="sm" p="md" radius="md">
            <Title order={4} mb="md">Low Stock Items</Title>
            {lowStockProducts.length === 0 ? (
              <Alert title="No low stock items" color="teal" icon={<IconCheck />}>
                All products have sufficient stock levels.
              </Alert>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>SKU</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Current Stock</Table.Th>
                    <Table.Th>Reorder Level</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {lowStockProducts.map((product) => (
                    <Table.Tr key={product.id}>
                      <Table.Td>{product.name}</Table.Td>
                      <Table.Td>{product.sku}</Table.Td>
                      <Table.Td>{product.category}</Table.Td>
                      <Table.Td>{product.currentStock}</Table.Td>
                      <Table.Td>{product.reorderLevel}</Table.Td>
                      <Table.Td>{renderStockStatus(product)}</Table.Td>
                      <Table.Td>
                        <Button size="xs" variant="outline">
                          Create Purchase
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="expiring">
          <Card shadow="sm" p="md" radius="md">
            <Title order={4} mb="md">Expiring Products</Title>
            {expiringProducts.length === 0 ? (
              <Alert title="No expiring products" color="teal" icon={<IconCheck />}>
                No products are expiring soon.
              </Alert>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Batch Number</Table.Th>
                    <Table.Th>Expiry Date</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Days to Expiry</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {expiringProducts.map((item) => (
                    <Table.Tr key={item.id}>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td>{item.batchNumber}</Table.Td>
                      <Table.Td>{new Date(item.expiryDate).toLocaleDateString()}</Table.Td>
                      <Table.Td>{item.currentQuantity}</Table.Td>
                      <Table.Td>{item.daysToExpiry}</Table.Td>
                      <Table.Td>
                        {item.status === 'EXPIRED' ? (
                          <Badge color="red">Expired</Badge>
                        ) : item.status === 'EXPIRING_SOON' ? (
                          <Badge color="orange">Expiring Soon</Badge>
                        ) : (
                          <Badge color="green">Valid</Badge>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Create/Edit Product Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title={editMode ? "Edit Product" : "Add New Product"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleCreateProduct)}>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Product Name"
                placeholder="Enter product name"
                required
                {...form.getInputProps('name')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="SKU"
                placeholder="Enter SKU"
                required
                {...form.getInputProps('sku')}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Description"
                placeholder="Enter product description"
                {...form.getInputProps('description')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Category"
                placeholder="Enter category"
                required
                {...form.getInputProps('category')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Manufacturer"
                placeholder="Enter manufacturer"
                {...form.getInputProps('manufacturer')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Dosage Form"
                placeholder="e.g., tablet, capsule, liquid"
                {...form.getInputProps('dosageForm')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Strength"
                placeholder="e.g., 500mg, 10ml"
                {...form.getInputProps('strength')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Cost Price"
                placeholder="0.00"
                required
                min={0}
                {...form.getInputProps('costPrice')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Wholesale Price"
                placeholder="0.00"
                min={0}
                {...form.getInputProps('wholesalePrice')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Retail Price"
                placeholder="0.00"
                required
                min={0}
                {...form.getInputProps('retailPrice')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Current Stock"
                placeholder="0"
                min={0}
                {...form.getInputProps('currentStock')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Reorder Level"
                placeholder="10"
                min={0}
                required
                {...form.getInputProps('reorderLevel')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Barcode"
                placeholder="Enter barcode"
                {...form.getInputProps('barcode')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Expiry Date"
                placeholder="YYYY-MM-DD"
                {...form.getInputProps('expiryDate')}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>Cancel</Button>
            <Button type="submit">{editMode ? 'Update' : 'Create'}</Button>
          </Group>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Confirm Deletion"
        size="sm"
      >
        <Text mb="md">Are you sure you want to delete this product? This action cannot be undone.</Text>
        <Group justify="flex-end">
          <Button variant="light" onClick={() => setDeleteModalOpened(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteProduct}>
            Delete
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
