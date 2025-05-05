import { useState } from 'react';
import { 
  Title, 
  Paper, 
  Table, 
  Group, 
  TextInput, 
  Select, 
  Text,
  Badge
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useAuthStore } from '../../store/authStore';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  userRole: string;
  timestamp: string;
  details: string;
  category: 'auth' | 'data' | 'system' | 'report';
}

export function AuditLogs() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // This would be fetched from the API in a real implementation
  const mockAuditLogs: AuditLog[] = [
    {
      id: '1',
      action: 'User Login',
      user: 'executive@example.com',
      userRole: 'EXECUTIVE',
      timestamp: '2023-06-28 09:15:22',
      details: 'Successful login from IP 192.168.1.1',
      category: 'auth'
    },
    {
      id: '2',
      action: 'Report Submission',
      user: 'pharmacy@example.com',
      userRole: 'PHARMACY',
      timestamp: '2023-06-27 14:30:45',
      details: 'Monthly report submitted for May 2023',
      category: 'report'
    },
    {
      id: '3',
      action: 'Pharmacy Created',
      user: 'executive@example.com',
      userRole: 'EXECUTIVE',
      timestamp: '2023-06-25 11:20:18',
      details: 'New pharmacy "Health First Pharmacy" created',
      category: 'data'
    },
    {
      id: '4',
      action: 'Password Changed',
      user: 'pharmacy@example.com',
      userRole: 'PHARMACY',
      timestamp: '2023-06-24 16:45:33',
      details: 'User changed their password',
      category: 'auth'
    },
    {
      id: '5',
      action: 'System Maintenance',
      user: 'system',
      userRole: 'SYSTEM',
      timestamp: '2023-06-23 02:00:00',
      details: 'Scheduled database maintenance completed',
      category: 'system'
    },
  ];
  
  // Filter logs based on search query and category
  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !categoryFilter || log.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Function to determine badge color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'auth':
        return 'blue';
      case 'data':
        return 'green';
      case 'system':
        return 'yellow';
      case 'report':
        return 'violet';
      default:
        return 'gray';
    }
  };
  
  // Show different logs based on user role
  const isExecutive = user?.role === 'EXECUTIVE' || user?.role === 'ADMIN';

  return (
    <div>
      <Title order={2} mb="lg">Audit Logs</Title>
      
      <Group mb="xl">
        <TextInput
          placeholder="Search logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        
        <Select
          placeholder="Filter by Category"
          value={categoryFilter}
          onChange={setCategoryFilter}
          data={[
            { value: '', label: 'All Categories' },
            { value: 'auth', label: 'Authentication' },
            { value: 'data', label: 'Data Changes' },
            { value: 'system', label: 'System' },
            { value: 'report', label: 'Reports' }
          ]}
          style={{ width: 200 }}
          clearable
        />
        
        <DateInput
          placeholder="From Date"
          valueFormat="YYYY-MM-DD"
          style={{ width: 160 }}
        />
        
        <DateInput
          placeholder="To Date"
          valueFormat="YYYY-MM-DD"
          style={{ width: 160 }}
        />
      </Group>
      
      <Paper withBorder>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Timestamp</Table.Th>
              <Table.Th>Action</Table.Th>
              {isExecutive && <Table.Th>User</Table.Th>}
              <Table.Th>Category</Table.Th>
              <Table.Th>Details</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredLogs.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={isExecutive ? 5 : 4}>
                  <Text ta="center" c="dimmed">No audit logs found</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredLogs.map((log) => (
                <Table.Tr key={log.id}>
                  <Table.Td>{log.timestamp}</Table.Td>
                  <Table.Td>{log.action}</Table.Td>
                  {isExecutive && <Table.Td>{log.user}</Table.Td>}
                  <Table.Td>
                    <Badge color={getCategoryColor(log.category)}>
                      {log.category.charAt(0).toUpperCase() + log.category.slice(1)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{log.details}</Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}
