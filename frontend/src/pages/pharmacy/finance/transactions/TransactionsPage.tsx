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
import { useAuthStore } from '../../../../store/authStore';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
  IconEye,
  IconDownload,
  IconCash,
  IconCreditCard,
  IconArrowUp,
  IconArrowDown,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../../config';

// Define types
interface Transaction {
  id: string;
  date: Date;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  reference: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

interface TransactionFormData {
  date: Date;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  reference: string;
}

const TransactionsPage = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date(),
    type: 'INCOME',
    category: '',
    amount: 0,
    description: '',
    paymentMethod: 'CASH',
    reference: '',
  });

  // Fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedTransactions = response.data.data.transactions || [];
      setTransactions(fetchedTransactions);
      setFilteredTransactions(fetchedTransactions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again later.');
      setLoading(false);
    }
  };

  // Create a new transaction
  const createTransaction = async (data: TransactionFormData) => {
    try {
      const response = await axios.post(`${API_URL}/transactions`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      notifications.show({
        title: 'Success',
        message: 'Transaction created successfully',
        color: 'green',
      });

      fetchTransactions();
      return response.data.data.transaction;
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to create transaction. Please try again.';
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  };

  // Update an existing transaction
  const updateTransaction = async (
    id: string,
    data: Partial<TransactionFormData>
  ) => {
    try {
      const response = await axios.patch(
        `${API_URL}/transactions/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      notifications.show({
        title: 'Success',
        message: 'Transaction updated successfully',
        color: 'green',
      });

      fetchTransactions();
      return response.data.data.transaction;
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to update transaction. Please try again.';
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  };

  // Delete a transaction
  const deleteTransactionById = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      notifications.show({
        title: 'Success',
        message: 'Transaction deleted successfully',
        color: 'green',
      });

      fetchTransactions();
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to delete transaction. Please try again.';
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterTransactions(query, selectedType);
  };

  // Handle filter by type
  const handleFilterByType = (type: string | null) => {
    setSelectedType(type);
    filterTransactions(searchQuery, type);
  };

  // Filter transactions
  const filterTransactions = (query: string, type: string | null) => {
    let filtered = [...transactions];

    // Filter by search query
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(lowercaseQuery) ||
          t.category.toLowerCase().includes(lowercaseQuery) ||
          t.reference.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Filter by type
    if (type) {
      filtered = filtered.filter((t) => t.type === type);
    }

    // Sort transactions
    filtered = sortTransactions(filtered, sortField, sortDirection);

    setFilteredTransactions(filtered);
  };

  // Sort transactions
  const sortTransactions = (
    data: Transaction[],
    field: string,
    direction: 'asc' | 'desc'
  ) => {
    return [...data].sort((a, b) => {
      if (field === 'date') {
        return direction === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (field === 'amount') {
        return direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else {
        const aValue = (a as any)[field] || '';
        const bValue = (b as any)[field] || '';
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });
  };

  // Handle sort
  const handleSort = (field: string) => {
    const direction =
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    setFilteredTransactions(
      sortTransactions(filteredTransactions, field, direction)
    );
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  // Handle form submission
  const handleSubmitTransaction = async (values: typeof formData) => {
    try {
      if (selectedTransactionId) {
        await updateTransaction(selectedTransactionId, values);
        setUpdateModalOpen(false);
      } else {
        await createTransaction(values);
        setAddModalOpen(false);
      }
      // Reset form
      setFormData({
        date: new Date(),
        type: 'INCOME',
        category: '',
        amount: 0,
        description: '',
        paymentMethod: 'CASH',
        reference: '',
      });
      setSelectedTransactionId(null);
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  // Handle delete transaction
  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransactionById(id);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Container size="xl" px="xs">
      <Paper shadow="xs" p="md" withBorder>
        <Group position="apart" mb="md">
          <Title order={2}>Financial Transactions</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setAddModalOpen(true)}
            color="green"
          >
            Add Transaction
          </Button>
        </Group>

        {/* Search and Filter */}
        <Group mb="md">
          <TextInput
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            icon={<IconSearch size={16} />}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by type"
            value={selectedType}
            onChange={handleFilterByType}
            data={[
              { value: 'INCOME', label: 'Income' },
              { value: 'EXPENSE', label: 'Expense' },
            ]}
            clearable
            icon={<IconFilter size={16} />}
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
                fetchTransactions();
              }}
            >
              Retry
            </Button>
          </Alert>
        )}

        {/* Transactions Table */}
        {loading ? (
          <Box py="xl" style={{ display: 'flex', justifyContent: 'center' }}>
            <Loader size="lg" />
          </Box>
        ) : filteredTransactions.length === 0 && !error ? (
          <Alert color="blue" title="No transactions found">
            {searchQuery
              ? `No transactions match your search criteria "${searchQuery}".`
              : selectedType
              ? `No ${selectedType.toLowerCase()} transactions found.`
              : 'No transactions found. Add some transactions to get started.'}
          </Alert>
        ) : !error ? (
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th style={{ width: '10%' }}>
                  <Group
                    spacing="xs"
                    onClick={() => handleSort('date')}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>Date</span>
                    {sortField === 'date' &&
                      (sortDirection === 'asc' ? (
                        <IconSortAscending size={16} />
                      ) : (
                        <IconSortDescending size={16} />
                      ))}
                  </Group>
                </th>
                <th style={{ width: '10%' }}>Type</th>
                <th style={{ width: '15%' }}>Category</th>
                <th style={{ width: '15%' }}>
                  <Group
                    spacing="xs"
                    onClick={() => handleSort('amount')}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>Amount</span>
                    {sortField === 'amount' &&
                      (sortDirection === 'asc' ? (
                        <IconSortAscending size={16} />
                      ) : (
                        <IconSortDescending size={16} />
                      ))}
                  </Group>
                </th>
                <th style={{ width: '20%' }}>Description</th>
                <th style={{ width: '10%' }}>Payment Method</th>
                <th style={{ width: '10%' }}>Reference</th>
                <th style={{ width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>
                    <Badge
                      color={transaction.type === 'INCOME' ? 'green' : 'red'}
                    >
                      {transaction.type}
                    </Badge>
                  </td>
                  <td>{transaction.category}</td>
                  <td>{formatCurrency(transaction.amount)}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.paymentMethod}</td>
                  <td>{transaction.reference}</td>
                  <td>
                    <Group spacing="xs">
                      <ActionIcon
                        color="blue"
                        onClick={() => {
                          setSelectedTransactionId(transaction.id);
                          // Set form data for update
                          setFormData({
                            date: new Date(transaction.date),
                            type: transaction.type,
                            category: transaction.category,
                            amount: transaction.amount,
                            description: transaction.description,
                            paymentMethod: transaction.paymentMethod,
                            reference: transaction.reference,
                          });
                          setUpdateModalOpen(true);
                        }}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
      </Paper>

      {/* Add Transaction Modal */}
      <Modal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Transaction"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitTransaction(formData);
          }}
        >
          <Stack spacing="md">
            <DateInput
              label="Transaction Date"
              placeholder="Select date"
              value={formData.date}
              onChange={(value) =>
                setFormData({ ...formData, date: value || new Date() })
              }
              required
              clearable={false}
            />

            <Select
              label="Transaction Type"
              placeholder="Select type"
              value={formData.type}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  type: value as 'INCOME' | 'EXPENSE',
                })
              }
              data={[
                { value: 'INCOME', label: 'Income' },
                { value: 'EXPENSE', label: 'Expense' },
              ]}
              required
              icon={
                formData.type === 'INCOME' ? (
                  <IconArrowUp size={16} />
                ) : (
                  <IconArrowDown size={16} />
                )
              }
            />

            <Select
              label="Category"
              placeholder="Select category"
              value={formData.category}
              onChange={(value) =>
                setFormData({ ...formData, category: value || '' })
              }
              data={
                formData.type === 'INCOME'
                  ? [
                      { value: 'Sales', label: 'Sales' },
                      { value: 'Services', label: 'Services' },
                      { value: 'Refunds', label: 'Refunds' },
                      { value: 'Investments', label: 'Investments' },
                      { value: 'Other', label: 'Other Income' },
                    ]
                  : [
                      { value: 'Inventory', label: 'Inventory Purchase' },
                      { value: 'Rent', label: 'Rent' },
                      { value: 'Utilities', label: 'Utilities' },
                      { value: 'Salaries', label: 'Salaries' },
                      { value: 'Equipment', label: 'Equipment' },
                      { value: 'Marketing', label: 'Marketing' },
                      { value: 'Maintenance', label: 'Maintenance' },
                      { value: 'Other', label: 'Other Expense' },
                    ]
              }
              required
              searchable
            />

            <NumberInput
              label="Amount (₦)"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(value) =>
                setFormData({ ...formData, amount: value || 0 })
              }
              required
              min={0}
              step={100}
            />

            <Textarea
              label="Description"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              minRows={2}
            />

            <Select
              label="Payment Method"
              placeholder="Select payment method"
              value={formData.paymentMethod}
              onChange={(value) =>
                setFormData({ ...formData, paymentMethod: value || 'CASH' })
              }
              data={[
                { value: 'CASH', label: 'Cash' },
                { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                { value: 'CARD', label: 'Card Payment' },
                { value: 'MOBILE_MONEY', label: 'Mobile Money' },
                { value: 'CREDIT', label: 'Credit' },
                { value: 'OTHER', label: 'Other' },
              ]}
              required
              icon={<IconCash size={16} />}
            />

            <TextInput
              label="Reference Number"
              placeholder="Enter reference number (optional)"
              value={formData.reference}
              onChange={(e) =>
                setFormData({ ...formData, reference: e.target.value })
              }
            />

            <Group position="right" mt="md">
              <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" color="green">
                Add Transaction
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal
        opened={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        title="Edit Transaction"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitTransaction(formData);
          }}
        >
          <Stack spacing="md">
            <DateInput
              label="Transaction Date"
              placeholder="Select date"
              value={formData.date}
              onChange={(value) =>
                setFormData({ ...formData, date: value || new Date() })
              }
              required
              clearable={false}
            />

            <Select
              label="Transaction Type"
              placeholder="Select type"
              value={formData.type}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  type: value as 'INCOME' | 'EXPENSE',
                })
              }
              data={[
                { value: 'INCOME', label: 'Income' },
                { value: 'EXPENSE', label: 'Expense' },
              ]}
              required
              icon={
                formData.type === 'INCOME' ? (
                  <IconArrowUp size={16} />
                ) : (
                  <IconArrowDown size={16} />
                )
              }
            />

            <Select
              label="Category"
              placeholder="Select category"
              value={formData.category}
              onChange={(value) =>
                setFormData({ ...formData, category: value || '' })
              }
              data={
                formData.type === 'INCOME'
                  ? [
                      { value: 'Sales', label: 'Sales' },
                      { value: 'Services', label: 'Services' },
                      { value: 'Refunds', label: 'Refunds' },
                      { value: 'Investments', label: 'Investments' },
                      { value: 'Other', label: 'Other Income' },
                    ]
                  : [
                      { value: 'Inventory', label: 'Inventory Purchase' },
                      { value: 'Rent', label: 'Rent' },
                      { value: 'Utilities', label: 'Utilities' },
                      { value: 'Salaries', label: 'Salaries' },
                      { value: 'Equipment', label: 'Equipment' },
                      { value: 'Marketing', label: 'Marketing' },
                      { value: 'Maintenance', label: 'Maintenance' },
                      { value: 'Other', label: 'Other Expense' },
                    ]
              }
              required
              searchable
            />

            <NumberInput
              label="Amount (₦)"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(value) =>
                setFormData({ ...formData, amount: value || 0 })
              }
              required
              min={0}
              step={100}
            />

            <Textarea
              label="Description"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              minRows={2}
            />

            <Select
              label="Payment Method"
              placeholder="Select payment method"
              value={formData.paymentMethod}
              onChange={(value) =>
                setFormData({ ...formData, paymentMethod: value || 'CASH' })
              }
              data={[
                { value: 'CASH', label: 'Cash' },
                { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                { value: 'CARD', label: 'Card Payment' },
                { value: 'MOBILE_MONEY', label: 'Mobile Money' },
                { value: 'CREDIT', label: 'Credit' },
                { value: 'OTHER', label: 'Other' },
              ]}
              required
              icon={<IconCash size={16} />}
            />

            <TextInput
              label="Reference Number"
              placeholder="Enter reference number (optional)"
              value={formData.reference}
              onChange={(e) =>
                setFormData({ ...formData, reference: e.target.value })
              }
            />

            <Group position="right" mt="md">
              <Button
                variant="outline"
                onClick={() => setUpdateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" color="blue">
                Update Transaction
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};

export default TransactionsPage;
