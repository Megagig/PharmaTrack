import { useState } from 'react';
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
  Badge
} from '@mantine/core';
import { DateInput } from '@mantine/dates';

export function StockManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | null>(null);
  
  // This would be fetched from the API in a real implementation
  const mockMedications = [
    { 
      id: '1', 
      name: 'Paracetamol 500mg', 
      category: 'Analgesic', 
      quantity: 250, 
      expiryDate: '2024-06-15',
      status: 'In Stock'
    },
    { 
      id: '2', 
      name: 'Amoxicillin 250mg', 
      category: 'Antibiotic', 
      quantity: 120, 
      expiryDate: '2024-03-20',
      status: 'In Stock'
    },
    { 
      id: '3', 
      name: 'Metformin 500mg', 
      category: 'Antidiabetic', 
      quantity: 180, 
      expiryDate: '2024-08-10',
      status: 'In Stock'
    },
    { 
      id: '4', 
      name: 'Lisinopril 10mg', 
      category: 'Antihypertensive', 
      quantity: 90, 
      expiryDate: '2024-05-05',
      status: 'Low Stock'
    },
    { 
      id: '5', 
      name: 'Salbutamol Inhaler', 
      category: 'Bronchodilator', 
      quantity: 15, 
      expiryDate: '2024-07-22',
      status: 'Low Stock'
    },
    { 
      id: '6', 
      name: 'Ciprofloxacin 500mg', 
      category: 'Antibiotic', 
      quantity: 0, 
      expiryDate: '2024-04-18',
      status: 'Out of Stock'
    },
  ];
  
  // Filter medications based on search query
  const filteredMedications = mockMedications.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Find the selected medication for the update modal
  const selectedMedication = mockMedications.find(med => med.id === selectedMedicationId);
  
  const handleAddMedication = () => {
    // In a real implementation, this would call the API
    setAddModalOpen(false);
  };
  
  const handleUpdateMedication = () => {
    // In a real implementation, this would call the API
    setUpdateModalOpen(false);
    setSelectedMedicationId(null);
  };
  
  const openUpdateModal = (id: string) => {
    setSelectedMedicationId(id);
    setUpdateModalOpen(true);
  };
  
  // Function to determine badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'green';
      case 'Low Stock':
        return 'yellow';
      case 'Out of Stock':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div>
      <Title order={2} mb="lg">Stock Management</Title>
      
      <Group mb="md">
        <TextInput
          placeholder="Search medications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button onClick={() => setAddModalOpen(true)}>Add Medication</Button>
      </Group>
      
      <Paper withBorder>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Medication Name</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Expiry Date</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredMedications.map((medication) => (
              <Table.Tr key={medication.id}>
                <Table.Td>{medication.name}</Table.Td>
                <Table.Td>{medication.category}</Table.Td>
                <Table.Td>{medication.quantity}</Table.Td>
                <Table.Td>{medication.expiryDate}</Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(medication.status)}>
                    {medication.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button size="xs" variant="outline" onClick={() => openUpdateModal(medication.id)}>
                      Update
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
      
      {/* Add Medication Modal */}
      <Modal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={<Title order={3}>Add New Medication</Title>}
      >
        <Stack>
          <TextInput
            label="Medication Name"
            placeholder="Enter medication name"
            required
          />
          
          <Select
            label="Category"
            placeholder="Select category"
            data={[
              'Analgesic', 'Antibiotic', 'Antidiabetic', 
              'Antihypertensive', 'Bronchodilator', 'Antihistamine',
              'Anti-inflammatory', 'Antiviral', 'Other'
            ]}
            required
          />
          
          <NumberInput
            label="Quantity"
            placeholder="Enter quantity"
            min={0}
            required
          />
          
          <DateInput
            label="Expiry Date"
            placeholder="Select date"
            required
          />
          
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMedication}>Add Medication</Button>
          </Group>
        </Stack>
      </Modal>
      
      {/* Update Medication Modal */}
      <Modal
        opened={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedMedicationId(null);
        }}
        title={<Title order={3}>Update Medication</Title>}
      >
        {selectedMedication && (
          <Stack>
            <Text>Medication: {selectedMedication.name}</Text>
            <Text>Current Quantity: {selectedMedication.quantity}</Text>
            
            <NumberInput
              label="New Quantity"
              placeholder="Enter new quantity"
              min={0}
              defaultValue={selectedMedication.quantity}
              required
            />
            
            <DateInput
              label="New Expiry Date"
              placeholder="Select date"
              defaultValue={new Date(selectedMedication.expiryDate)}
            />
            
            <Group justify="flex-end" mt="md">
              <Button 
                variant="outline" 
                onClick={() => {
                  setUpdateModalOpen(false);
                  setSelectedMedicationId(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateMedication}>Update</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </div>
  );
}
