import { useState } from 'react';
import { 
  Title, 
  Paper, 
  TextInput, 
  Button, 
  Group, 
  Divider, 
  Stack,
  Text,
  Alert,
  PasswordInput
} from '@mantine/core';
import { useAuthStore } from '../../store/authStore';

export function Profile() {
  const { user } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // This would be fetched from the API in a real implementation
  const mockPharmacyData = {
    id: user?.pharmacyId || '1',
    name: 'Community Pharmacy',
    pharmacistInCharge: 'Jane Smith',
    pcnLicenseNumber: 'PCN12345',
    phoneNumber: '08012345678',
    email: 'community.pharmacy@example.com',
    address: '123 Health Street',
    ward: 'Ward 2',
    lga: 'LGA 1',
  };
  
  const handleSaveProfile = () => {
    // In a real implementation, this would call the API
    
    // Simulate API call
    setTimeout(() => {
      setEditMode(false);
      setSuccessMessage('Profile updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1000);
  };
  
  return (
    <div>
      <Title order={2} mb="lg">Pharmacy Profile</Title>
      
      {successMessage && (
        <Alert color="green" mb="md" withCloseButton onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      
      <Paper withBorder p="md" mb="xl">
        <Group position="apart" mb="md">
          <Title order={3}>Pharmacy Information</Title>
          <Button 
            variant={editMode ? "outline" : "filled"} 
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Group>
        
        <Stack>
          <TextInput
            label="Pharmacy Name"
            defaultValue={mockPharmacyData.name}
            readOnly={!editMode}
          />
          
          <TextInput
            label="Pharmacist in Charge"
            defaultValue={mockPharmacyData.pharmacistInCharge}
            readOnly={!editMode}
          />
          
          <TextInput
            label="PCN License Number"
            defaultValue={mockPharmacyData.pcnLicenseNumber}
            readOnly={true} // Always read-only as it's a unique identifier
          />
          
          <TextInput
            label="Phone Number"
            defaultValue={mockPharmacyData.phoneNumber}
            readOnly={!editMode}
          />
          
          <TextInput
            label="Email"
            defaultValue={mockPharmacyData.email}
            readOnly={!editMode}
          />
          
          <TextInput
            label="Address"
            defaultValue={mockPharmacyData.address}
            readOnly={!editMode}
          />
          
          <Group grow>
            <TextInput
              label="Ward"
              defaultValue={mockPharmacyData.ward}
              readOnly={!editMode}
            />
            
            <TextInput
              label="LGA"
              defaultValue={mockPharmacyData.lga}
              readOnly={!editMode}
            />
          </Group>
          
          {editMode && (
            <Group justify="flex-end" mt="md">
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </Group>
          )}
        </Stack>
      </Paper>
      
      <Paper withBorder p="md">
        <Title order={3} mb="md">Account Settings</Title>
        
        <Stack>
          <TextInput
            label="Email"
            defaultValue={user?.email || 'pharmacy@example.com'}
            readOnly
          />
          
          <Divider my="md" label="Change Password" labelPosition="center" />
          
          <PasswordInput
            label="Current Password"
            placeholder="Enter your current password"
          />
          
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
          />
          
          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm new password"
          />
          
          <Group justify="flex-end" mt="md">
            <Button>Update Password</Button>
          </Group>
        </Stack>
      </Paper>
    </div>
  );
}
