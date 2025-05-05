import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Text,
  Alert,
  SegmentedControl,
  Stack,
  Group,
  Divider,
  Select,
  Checkbox,
  Box,
  Stepper,
  useMantineTheme,
} from '@mantine/core';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../store/authStore';
import { PublicLayout } from '../../components/layout/PublicLayout';

export function Register() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [active, setActive] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserRole>('PHARMACY');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  const [pharmacyPhone, setPharmacyPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const nextStep = () => {
    if (active === 0) {
      // Validate first step
      if (!email || !password || !confirmPassword || !firstName || !lastName) {
        setError('Please fill in all required fields');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
    }
    
    if (active === 1 && userType === 'PHARMACY') {
      // Validate pharmacy details
      if (!pharmacyName || !pharmacyAddress || !pharmacyPhone || !licenseNumber) {
        setError('Please fill in all pharmacy details');
        return;
      }
    }
    
    setError('');
    setActive((current) => (current < 2 ? current + 1 : current));
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate a successful registration

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to login page after successful registration
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <Container size="sm" py={50}>
        <Title order={2} ta="center" mb="xl">
          Create Your PharmaTrack Account
        </Title>

        <Paper withBorder shadow="md" p={{ base: 'md', sm: 30 }} radius="md">
          <Stepper active={active} onStepClick={setActive} breakpoint="sm" mb="xl">
            <Stepper.Step label="Account Details" description="Basic information">
              <Stack>
                <Group grow>
                  <TextInput
                    label="First Name"
                    placeholder="John"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextInput
                    label="Last Name"
                    placeholder="Doe"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Group>

                <TextInput
                  label="Email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Create a strong password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Stack mb="md">
                  <Text fw={500} size="sm">
                    Register As
                  </Text>
                  <SegmentedControl
                    value={userType}
                    onChange={(value) => setUserType(value as UserRole)}
                    data={[
                      { label: 'Pharmacy', value: 'PHARMACY' },
                      { label: 'Executive', value: 'EXECUTIVE' },
                    ]}
                    fullWidth
                  />
                </Stack>
              </Stack>
            </Stepper.Step>

            <Stepper.Step label="Organization Details" description="Your organization">
              {userType === 'PHARMACY' ? (
                <Stack>
                  <TextInput
                    label="Pharmacy Name"
                    placeholder="Community Pharmacy"
                    required
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                  />

                  <TextInput
                    label="Pharmacy Address"
                    placeholder="123 Health Street, City"
                    required
                    value={pharmacyAddress}
                    onChange={(e) => setPharmacyAddress(e.target.value)}
                  />

                  <TextInput
                    label="Pharmacy Phone"
                    placeholder="+1 (555) 123-4567"
                    required
                    value={pharmacyPhone}
                    onChange={(e) => setPharmacyPhone(e.target.value)}
                  />

                  <TextInput
                    label="License Number"
                    placeholder="PHR-12345"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />

                  <Select
                    label="Pharmacy Type"
                    placeholder="Select pharmacy type"
                    data={[
                      'Community Pharmacy',
                      'Hospital Pharmacy',
                      'Clinical Pharmacy',
                      'Retail Pharmacy',
                      'Other',
                    ]}
                  />
                </Stack>
              ) : (
                <Stack>
                  <TextInput
                    label="Organization Name"
                    placeholder="Health Department"
                    required
                  />

                  <TextInput
                    label="Department"
                    placeholder="Pharmacy Oversight"
                    required
                  />

                  <TextInput
                    label="Position/Title"
                    placeholder="Director"
                    required
                  />

                  <Select
                    label="Access Level Requested"
                    placeholder="Select access level"
                    data={[
                      'Regional Manager',
                      'State Director',
                      'National Administrator',
                      'Analyst',
                      'Other',
                    ]}
                  />
                </Stack>
              )}
            </Stepper.Step>

            <Stepper.Step label="Confirmation" description="Review and submit">
              <Stack>
                <Title order={4} mb="md">
                  Review Your Information
                </Title>

                <Box mb="md">
                  <Text fw={700}>Account Details</Text>
                  <Text>
                    {firstName} {lastName}
                  </Text>
                  <Text>{email}</Text>
                  <Text>Account Type: {userType}</Text>
                </Box>

                {userType === 'PHARMACY' && (
                  <Box mb="md">
                    <Text fw={700}>Pharmacy Details</Text>
                    <Text>{pharmacyName}</Text>
                    <Text>{pharmacyAddress}</Text>
                    <Text>{pharmacyPhone}</Text>
                    <Text>License: {licenseNumber}</Text>
                  </Box>
                )}

                <Checkbox
                  label={
                    <Text size="sm">
                      I agree to the{' '}
                      <Text component="a" href="/terms" c={theme.colors.blue[6]} inherit>
                        Terms of Service
                      </Text>{' '}
                      and{' '}
                      <Text component="a" href="/privacy" c={theme.colors.blue[6]} inherit>
                        Privacy Policy
                      </Text>
                    </Text>
                  }
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                />

                <Button fullWidth onClick={handleSubmit} loading={loading} mt="md">
                  Complete Registration
                </Button>
              </Stack>
            </Stepper.Step>
          </Stepper>

          {error && (
            <Alert color="red" mb="md">
              {error}
            </Alert>
          )}

          <Group justify="space-between" mt="xl">
            {active > 0 && (
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
            {active < 2 && (
              <Button onClick={nextStep} ml="auto">
                Next Step
              </Button>
            )}
          </Group>

          <Divider my="lg" label="Or" labelPosition="center" />

          <Text ta="center" size="sm">
            Already have an account?{' '}
            <Text component={Link} to="/login" c={theme.colors.blue[6]} inherit>
              Log in
            </Text>
          </Text>
        </Paper>
      </Container>
    </PublicLayout>
  );
}
