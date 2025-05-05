import { useState, useEffect } from 'react';
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
  PasswordInput,
  LoadingOverlay,
} from '@mantine/core';
import { useAuthStore } from '../../store/authStore';
import {
  pharmacyService,
  Pharmacy,
  PharmacyUpdateRequest,
} from '../../services/pharmacyService';
import { authService, ChangePasswordRequest } from '../../services/authService';

export function Profile() {
  const { user } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);

  // Form state
  const [formData, setFormData] = useState<PharmacyUpdateRequest>({});

  // Password change state
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Fetch pharmacy data
  useEffect(() => {
    const fetchPharmacyData = async () => {
      if (!user?.pharmacyId) {
        setLoading(false);
        return;
      }

      try {
        const data = await pharmacyService.getPharmacyById(user.pharmacyId);
        setPharmacy(data);
        setFormData({
          name: data.name,
          pharmacistInCharge: data.pharmacistInCharge,
          phoneNumber: data.phoneNumber,
          email: data.email,
          address: data.address,
          ward: data.ward,
          lga: data.lga,
        });
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.message || 'Failed to load pharmacy data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacyData();
  }, [user?.pharmacyId]);

  // Handle form input changes
  const handleInputChange = (
    field: keyof PharmacyUpdateRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (
    field: keyof ChangePasswordRequest,
    value: string
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!user?.pharmacyId || !pharmacy) return;

    setLoading(true);
    try {
      const updatedPharmacy = await pharmacyService.updatePharmacy(
        user.pharmacyId,
        formData
      );
      setPharmacy(updatedPharmacy);
      setEditMode(false);
      setSuccessMessage('Profile updated successfully');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    // Validate passwords
    if (passwordData.newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    setPasswordError('');
    setLoading(true);

    try {
      await authService.changePassword(passwordData);
      setPasswordSuccess('Password updated successfully');

      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
      });
      setConfirmPassword('');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess('');
      }, 3000);
    } catch (error: any) {
      setPasswordError(
        error.response?.data?.message || 'Failed to update password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title order={2} mb="lg">
        Pharmacy Profile
      </Title>

      {successMessage && (
        <Alert
          color="green"
          mb="md"
          withCloseButton
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert
          color="red"
          mb="md"
          withCloseButton
          onClose={() => setErrorMessage('')}
        >
          {errorMessage}
        </Alert>
      )}

      <Paper withBorder p="md" mb="xl" pos="relative">
        <LoadingOverlay visible={loading} />

        <Group position="apart" mb="md">
          <Title order={3}>Pharmacy Information</Title>
          <Button
            variant={editMode ? 'outline' : 'filled'}
            onClick={() => setEditMode(!editMode)}
            disabled={!pharmacy}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Group>

        {pharmacy ? (
          <Stack>
            <TextInput
              label="Pharmacy Name"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              readOnly={!editMode}
            />

            <TextInput
              label="Pharmacist in Charge"
              value={formData.pharmacistInCharge || ''}
              onChange={(e) =>
                handleInputChange('pharmacistInCharge', e.target.value)
              }
              readOnly={!editMode}
            />

            <TextInput
              label="PCN License Number"
              value={pharmacy.pcnLicenseNumber}
              readOnly={true} // Always read-only as it's a unique identifier
            />

            <TextInput
              label="Phone Number"
              value={formData.phoneNumber || ''}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              readOnly={!editMode}
            />

            <TextInput
              label="Email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              readOnly={!editMode}
            />

            <TextInput
              label="Address"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              readOnly={!editMode}
            />

            <Group grow>
              <TextInput
                label="Ward"
                value={formData.ward || ''}
                onChange={(e) => handleInputChange('ward', e.target.value)}
                readOnly={!editMode}
              />

              <TextInput
                label="LGA"
                value={formData.lga || ''}
                onChange={(e) => handleInputChange('lga', e.target.value)}
                readOnly={!editMode}
              />
            </Group>

            {editMode && (
              <Group justify="flex-end" mt="md">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </Group>
            )}
          </Stack>
        ) : (
          !loading && (
            <Text c="dimmed" ta="center" py="xl">
              No pharmacy information available. Please contact an
              administrator.
            </Text>
          )
        )}
      </Paper>

      <Paper withBorder p="md" pos="relative">
        <LoadingOverlay visible={loading} />

        <Title order={3} mb="md">
          Account Settings
        </Title>

        {passwordSuccess && (
          <Alert
            color="green"
            mb="md"
            withCloseButton
            onClose={() => setPasswordSuccess('')}
          >
            {passwordSuccess}
          </Alert>
        )}

        {passwordError && (
          <Alert
            color="red"
            mb="md"
            withCloseButton
            onClose={() => setPasswordError('')}
          >
            {passwordError}
          </Alert>
        )}

        <Stack>
          <TextInput label="Email" value={user?.email || ''} readOnly />

          <Divider my="md" label="Change Password" labelPosition="center" />

          <PasswordInput
            label="Current Password"
            placeholder="Enter your current password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              handlePasswordChange('currentPassword', e.target.value)
            }
            required
          />

          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            value={passwordData.newPassword}
            onChange={(e) =>
              handlePasswordChange('newPassword', e.target.value)
            }
            required
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button onClick={handleChangePassword}>Update Password</Button>
          </Group>
        </Stack>
      </Paper>
    </div>
  );
}
