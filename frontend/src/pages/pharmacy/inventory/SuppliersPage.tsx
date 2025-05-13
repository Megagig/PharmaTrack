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
  Modal,
  Textarea,
  Grid,
  Alert,
  Badge,
  Select,
  Tabs
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconUsers,
  IconBuildingStore,
  IconPhone,
  IconMail,
  IconMapPin,
  IconSortAscending,
  IconSortDescending
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { API_URL } from '../../../config';
import { useAuthStore } from '../../../store/authStore';

interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId: string;
  paymentTerms: string;
  notes: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export function SuppliersPage() {
  const { token } = useAuthStore();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [opened, { open, close }] = useDisclosure(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSupplierId, setCurrentSupplierId] = useState<string | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  
  const ITEMS_PER_PAGE = 10;

  const form = useForm({
    initialValues: {
      name: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      taxId: '',
      paymentTerms: '',
      notes: '',
      status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (value.trim().length > 0 ? null : 'Phone is required'),
    },
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [searchQuery, statusFilter, suppliers, sortField, sortDirection]);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/suppliers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuppliers(response.data.data.suppliers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch suppliers. Please try again.',
        color: 'red',
      });
      setLoading(false);
    }
  };

  const filterSuppliers = () => {
    let filtered = [...suppliers];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.phone.includes(searchQuery)
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((supplier) => supplier.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const fieldA = a[sortField as keyof Supplier];
      const fieldB = b[sortField as keyof Supplier];
      
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

    setFilteredSuppliers(filtered);
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

  const handleCreateSupplier = async (values: typeof form.values) => {
    try {
      if (editMode && currentSupplierId) {
        await axios.patch(`${API_URL}/suppliers/${currentSupplierId}`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({
          title: 'Success',
          message: 'Supplier updated successfully',
          color: 'teal',
        });
      } else {
        await axios.post(`${API_URL}/suppliers`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({
          title: 'Success',
          message: 'Supplier created successfully',
          color: 'teal',
        });
      }
      close();
      form.reset();
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to save supplier. Please try again.',
        color: 'red',
      });
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditMode(true);
    setCurrentSupplierId(supplier.id);
    form.setValues({
      name: supplier.name,
      contactName: supplier.contactName,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      city: supplier.city,
      state: supplier.state,
      zipCode: supplier.zipCode,
      country: supplier.country,
      taxId: supplier.taxId || '',
      paymentTerms: supplier.paymentTerms || '',
      notes: supplier.notes || '',
      status: supplier.status
    });
    open();
  };

  const handleOpenCreateModal = () => {
    setEditMode(false);
    setCurrentSupplierId(null);
    form.reset();
    open();
  };

  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return;
    
    try {
      await axios.delete(`${API_URL}/suppliers/${supplierToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notifications.show({
        title: 'Success',
        message: 'Supplier deleted successfully',
        color: 'teal',
      });
      setDeleteModalOpened(false);
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete supplier. It may be referenced by purchases.',
        color: 'red',
      });
    }
  };

  const openDeleteModal = (id: string) => {
    setSupplierToDelete(id);
    setDeleteModalOpened(true);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
    setSortField('name');
    setSortDirection('asc');
  };

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Container size="xl" px="xs">
      <Title order={2} mb="md">
        Supplier Management
      </Title>

      <Tabs defaultValue="all">
        <Tabs.List mb="md">
          <Tabs.Tab value="all" leftSection={<IconUsers size={16} />}>
            All Suppliers
          </Tabs.Tab>
          <Tabs.Tab value="active" leftSection={<IconBuildingStore size={16} />}>
            Active Suppliers
          </Tabs.Tab>
          <Tabs.Tab value="inactive" leftSection={<IconBuildingStore size={16} />}>
            Inactive Suppliers
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all">
          <Card shadow="sm" p="md" radius="md" mb="md">
            <Group justify="space-between" mb="md">
              <Group>
                <TextInput
                  placeholder="Search suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  leftSection={<IconSearch size={16} />}
                />
                <Select
                  placeholder="Filter by status"
                  data={[
                    { value: 'ACTIVE', label: 'Active' },
                    { value: 'INACTIVE', label: 'Inactive' }
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  clearable
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
                Add Supplier
              </Button>
            </Group>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Loader />
              </div>
            ) : paginatedSuppliers.length === 0 ? (
              <Alert title="No suppliers found" color="gray">
                No suppliers match your current filters. Try adjusting your search criteria or add a new supplier.
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
                        <Group gap={5} onClick={() => handleSort('contactName')} style={{ cursor: 'pointer' }}>
                          Contact Person
                          {sortField === 'contactName' && (
                            sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                          )}
                        </Group>
                      </Table.Th>
                      <Table.Th>
                        <IconPhone size={16} />
                      </Table.Th>
                      <Table.Th>
                        <IconMail size={16} />
                      </Table.Th>
                      <Table.Th>
                        <IconMapPin size={16} />
                      </Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th style={{ width: 80 }}>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedSuppliers.map((supplier) => (
                      <Table.Tr key={supplier.id}>
                        <Table.Td>{supplier.name}</Table.Td>
                        <Table.Td>{supplier.contactName}</Table.Td>
                        <Table.Td>{supplier.phone}</Table.Td>
                        <Table.Td>{supplier.email}</Table.Td>
                        <Table.Td>{`${supplier.city}, ${supplier.country}`}</Table.Td>
                        <Table.Td>
                          <Badge color={supplier.status === 'ACTIVE' ? 'green' : 'gray'}>
                            {supplier.status}
                          </Badge>
                        </Table.Td>
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
                                onClick={() => handleEditSupplier(supplier)}
                              >
                                Edit
                              </Menu.Item>
                              <Menu.Item 
                                leftSection={<IconTrash size={16} />}
                                color="red"
                                onClick={() => openDeleteModal(supplier.id)}
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

        <Tabs.Panel value="active">
          <Card shadow="sm" p="md" radius="md">
            <Title order={4} mb="md">Active Suppliers</Title>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Loader />
              </div>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Contact Person</Table.Th>
                    <Table.Th>Phone</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Location</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {suppliers
                    .filter(s => s.status === 'ACTIVE')
                    .map((supplier) => (
                      <Table.Tr key={supplier.id}>
                        <Table.Td>{supplier.name}</Table.Td>
                        <Table.Td>{supplier.contactName}</Table.Td>
                        <Table.Td>{supplier.phone}</Table.Td>
                        <Table.Td>{supplier.email}</Table.Td>
                        <Table.Td>{`${supplier.city}, ${supplier.country}`}</Table.Td>
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

        <Tabs.Panel value="inactive">
          <Card shadow="sm" p="md" radius="md">
            <Title order={4} mb="md">Inactive Suppliers</Title>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Loader />
              </div>
            ) : suppliers.filter(s => s.status === 'INACTIVE').length === 0 ? (
              <Alert title="No inactive suppliers" color="gray">
                There are no inactive suppliers in the system.
              </Alert>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Contact Person</Table.Th>
                    <Table.Th>Phone</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Location</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {suppliers
                    .filter(s => s.status === 'INACTIVE')
                    .map((supplier) => (
                      <Table.Tr key={supplier.id}>
                        <Table.Td>{supplier.name}</Table.Td>
                        <Table.Td>{supplier.contactName}</Table.Td>
                        <Table.Td>{supplier.phone}</Table.Td>
                        <Table.Td>{supplier.email}</Table.Td>
                        <Table.Td>{`${supplier.city}, ${supplier.country}`}</Table.Td>
                        <Table.Td>
                          <Button 
                            size="xs" 
                            variant="outline"
                            onClick={() => {
                              handleEditSupplier({...supplier, status: 'ACTIVE'});
                            }}
                          >
                            Activate
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

      {/* Create/Edit Supplier Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        title={editMode ? "Edit Supplier" : "Add New Supplier"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleCreateSupplier)}>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Supplier Name"
                placeholder="Enter supplier name"
                required
                {...form.getInputProps('name')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Contact Person"
                placeholder="Enter contact person name"
                {...form.getInputProps('contactName')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Email"
                placeholder="Enter email address"
                required
                {...form.getInputProps('email')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Phone"
                placeholder="Enter phone number"
                required
                {...form.getInputProps('phone')}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Address"
                placeholder="Enter street address"
                {...form.getInputProps('address')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="City"
                placeholder="Enter city"
                {...form.getInputProps('city')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="State/Province"
                placeholder="Enter state or province"
                {...form.getInputProps('state')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Zip/Postal Code"
                placeholder="Enter zip or postal code"
                {...form.getInputProps('zipCode')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Country"
                placeholder="Enter country"
                {...form.getInputProps('country')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Tax ID"
                placeholder="Enter tax ID"
                {...form.getInputProps('taxId')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Payment Terms"
                placeholder="e.g., Net 30, COD"
                {...form.getInputProps('paymentTerms')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Status"
                placeholder="Select status"
                data={[
                  { value: 'ACTIVE', label: 'Active' },
                  { value: 'INACTIVE', label: 'Inactive' }
                ]}
                required
                {...form.getInputProps('status')}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Notes"
                placeholder="Enter additional notes"
                {...form.getInputProps('notes')}
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
        <Text mb="md">Are you sure you want to delete this supplier? This action cannot be undone.</Text>
        <Group justify="flex-end">
          <Button variant="light" onClick={() => setDeleteModalOpened(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteSupplier}>
            Delete
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
