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
import { IconPlus, IconEdit, IconTrash, IconSearch, IconFilter, IconSortAscending, IconSortDescending, IconEye, IconDownload } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

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
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
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

      // Simulate API call - replace with actual API call when backend is ready
      setTimeout(() => {
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            date: new Date('2023-05-15'),
            type: 'INCOME',
            category: 'Sales',
            amount: 25000,
            description: 'Daily sales',
            paymentMethod: 'CASH',
            reference: 'S-001',
            status: 'COMPLETED',
          },
          {
            id: '2',
            date: new Date('2023-05-14'),
            type: 'EXPENSE',
            category: 'Utilities',
            amount: 5000,
            description: 'Electricity bill',
            paymentMethod: 'TRANSFER',
            reference: 'E-001',
            status: 'COMPLETED',
          },
          {
            id: '3',
            date: new Date('2023-05-13'),
            type: 'INCOME',
            category: 'Sales',
            amount: 18000,
            description: 'Daily sales',
            paymentMethod: 'CASH',
            reference: 'S-002',
            status: 'COMPLETED',
          },
          {
            id: '4',
            date: new Date('2023-05-12'),
            type: 'EXPENSE',
            category: 'Inventory',
            amount: 35000,
            description: 'Stock purchase',
            paymentMethod: 'TRANSFER',
            reference: 'E-002',
            status: 'COMPLETED',
          },
          {
            id: '5',
            date: new Date('2023-05-11'),
            type: 'EXPENSE',
            category: 'Rent',
            amount: 50000,
            description: 'Monthly rent',
            paymentMethod: 'TRANSFER',
            reference: 'E-003',
            status: 'COMPLETED',
          },
        ];

        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again later.');
      setLoading(false);
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
        return direction === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
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
                  <Group spacing="xs" onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                    <span>Date</span>
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                    )}
                  </Group>
                </th>
                <th style={{ width: '10%' }}>Type</th>
                <th style={{ width: '15%' }}>Category</th>
                <th style={{ width: '15%' }}>
                  <Group spacing="xs" onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                    <span>Amount</span>
                    {sortField === 'amount' && (
                      sortDirection === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />
                    )}
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
                        onClick={() => {
                          // Handle delete
                          if (window.confirm('Are you sure you want to delete this transaction?')) {
                            // Delete transaction
                            const updatedTransactions = transactions.filter(
                              (t) => t.id !== transaction.id
                            );
                            setTransactions(updatedTransactions);
                            setFilteredTransactions(
                              filteredTransactions.filter(
                                (t) => t.id !== transaction.id
                              )
                            );
                            notifications.show({
                              title: 'Success',
                              message: 'Transaction deleted successfully',
                              color: 'green',
                            });
                          }
                        }}
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
    </Container>
  );
};

export default TransactionsPage;
