import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextInput, PasswordInput, Paper, Title, Container,
  Group, Button, Stack, Text, Stepper, Checkbox,
  Alert, Box, Center, SimpleGrid,
  useMantineTheme, useMantineColorScheme, Select,
} from '@mantine/core';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { authService } from '../../services/authService';
import { PasswordStrengthIndicator } from '../../components/forms/PasswordStrengthIndicator';
import { validateEmail, validatePassword } from '../../utils/formValidation';
import { LoadingAnimation } from '../../components/animations/LoadingAnimation';
import { AnimatedElement } from '../../components/animations/AnimatedElement';
import {
  IconUser, IconAt, IconLock, IconBuilding, IconCheck,
  IconMoon, IconSun, IconShieldLock, IconUsers, IconUserCheck,
} from '@tabler/icons-react';

// Define user role type
type UserRole = 'PHARMACY' | 'EXECUTIVE';

export function Register() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserRole>('PHARMACY');
  const [showAnimation, setShowAnimation] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  const [pharmacyPhone, setPharmacyPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [ward, setWard] = useState('');
  const [lga, setLga] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // Error states
  const [error, setError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [pharmacyNameError, setPharmacyNameError] = useState('');
  const [pharmacyAddressError, setPharmacyAddressError] = useState('');
  const [pharmacyPhoneError, setPharmacyPhoneError] = useState('');
  const [licenseNumberError, setLicenseNumberError] = useState('');
  const [wardError, setWardError] = useState('');
  const [lgaError, setLgaError] = useState('');

  // List of LGAs in Ogun State
  const ogunLGAs = [
    'Abeokuta North',
    'Abeokuta South',
    'Ado-Odo/Ota',
    'Ewekoro',
    'Ifo',
    'Ijebu East',
    'Ijebu North',
    'Ijebu North East',
    'Ijebu Ode',
    'Ikenne',
    'Imeko Afon',
    'Ipokia',
    'Obafemi Owode',
    'Odogbolu',
    'Odeda',
    'Ogun Waterside',
    'Remo North',
    'Shagamu',
    'Yewa North',
    'Yewa South'
  ];

  const validateFirstStep = () => {
    let isValid = true;

    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      isValid = false;
    } else {
      setFirstNameError('');
    }

    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      isValid = false;
    } else {
      setLastNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError(
        'Password must be at least 8 characters and include a number and special character'
      );
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const validateSecondStep = () => {
    if (userType !== 'PHARMACY') return true;

    let isValid = true;

    if (!pharmacyName.trim()) {
      setPharmacyNameError('Pharmacy name is required');
      isValid = false;
    } else {
      setPharmacyNameError('');
    }

    if (!pharmacyAddress.trim()) {
      setPharmacyAddressError('Address is required');
      isValid = false;
    } else {
      setPharmacyAddressError('');
    }

    if (!pharmacyPhone.trim()) {
      setPharmacyPhoneError('Phone number is required');
      isValid = false;
    } else {
      setPharmacyPhoneError('');
    }

    if (!licenseNumber.trim()) {
      setLicenseNumberError('License number is required');
      isValid = false;
    } else {
      setLicenseNumberError('');
    }

    if (!ward.trim()) {
      setWardError('Ward is required');
      isValid = false;
    } else {
      setWardError('');
    }

    if (!lga.trim()) {
      setLgaError('LGA is required');
      isValid = false;
    } else {
      setLgaError('');
    }

    return isValid;
  };

  const nextStep = () => {
    if (active === 0 && !validateFirstStep()) {
      return;
    }

    if (active === 1 && !validateSecondStep()) {
      return;
    }

    setActive((current) => (current < 2 ? current + 1 : current));
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  const handleSubmit = async () => {
    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (userType === 'PHARMACY') {
        // Register pharmacy
        await authService.register({
          email,
          password,
          role: userType,
        });

        setShowAnimation(true);
        setTimeout(() => {
          navigate('/login', {
            state: { message: 'Registration successful! You can now log in.' },
          });
        }, 2000);
      } else {
        // Register executive
        await authService.register({
          email,
          password,
          role: userType,
        });

        setShowAnimation(true);
        setTimeout(() => {
          navigate('/login', {
            state: {
              message:
                'Registration submitted! Your account will be reviewed by an administrator.',
            },
          });
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  if (showAnimation) {
    return (
      <Center style={{ height: '100vh', width: '100vw' }}>
        <LoadingAnimation />
      </Center>
    );
  }

  return (
    <PublicLayout>
      <Container size="xl" py={40}>
        {/* Theme toggle button */}
        <Box style={{ position: 'absolute', top: 20, right: 20 }}>
          <Button
            variant="subtle"
            radius="xl"
            size="sm"
            onClick={() => toggleColorScheme()}
            leftSection={colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          >
            {colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
        </Box>
        
        {/* Main content */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
          {/* Left side - branding */}
          <Box style={{ zIndex: 1 }}>
            <AnimatedElement type="fadeInDown">
              <Title order={2} mb={30}>
                Join the PharmaTrack Network
              </Title>
            </AnimatedElement>
            
            <Text size="xl" mb={40}>
              Create your account to start managing your pharmacy data, submitting reports, and accessing insights.
            </Text>
            
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb={50}>
              {[
                { title: 'Unified Access', description: 'Single platform for all your pharmacy management needs', icon: <IconShieldLock size={24} stroke={1.5} /> },
                { title: 'Data Insights', description: 'Gain valuable insights from your pharmacy data', icon: <IconUsers size={24} stroke={1.5} /> },
                { title: 'Role-Based Access', description: 'Permissions tailored to your role in the organization', icon: <IconUserCheck size={24} stroke={1.5} /> },
              ].map((feature, index) => (
                <Paper key={index} p="md" radius="md" withBorder>
                  <Group mb={10}>
                    <Box style={{ borderRadius: theme.radius.md, background: `linear-gradient(135deg, ${theme.colors.teal[5]} 0%, ${theme.colors.indigo[5]} 100%)`, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      {feature.icon}
                    </Box>
                    <Text fw={600}>{feature.title}</Text>
                  </Group>
                  <Text size="sm" c="dimmed">{feature.description}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Box>
          
          {/* Right side - registration form */}
          <Box style={{ zIndex: 1 }}>
            <Paper withBorder radius="lg" p={40}>
              <Stepper active={active} onStepClick={setActive} mb="xl" color="teal" radius="md" iconSize={28}>
                <Stepper.Step label="Account" description="Basic information" icon={<IconUser size={18} />} />
                <Stepper.Step label="Details" description="Organization info" icon={<IconBuilding size={18} />} />
                <Stepper.Step label="Review" description="Confirm details" icon={<IconCheck size={18} />} />
              </Stepper>

              {error && (
                <Alert color="red" mb="md" onClose={() => setError('')} radius="md" title="Registration Error">
                  {error}
                </Alert>
              )}

              {active === 0 && (
                <Stack gap="md">
                  <Group grow>
                    <TextInput label="First Name" placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} error={firstNameError} leftSection={<IconUser size={16} stroke={1.5} />} radius="md" />
                    <TextInput label="Last Name" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} error={lastNameError} radius="md" />
                  </Group>

                  <TextInput label="Email Address" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} leftSection={<IconAt size={16} stroke={1.5} />} radius="md" />

                  <PasswordInput label="Password" placeholder="Create a secure password" required value={password} onChange={(e) => setPassword(e.target.value)} error={passwordError} leftSection={<IconLock size={16} stroke={1.5} />} radius="md" />
                  <PasswordStrengthIndicator password={password} />

                  <PasswordInput label="Confirm Password" placeholder="Confirm your password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={confirmPasswordError} leftSection={<IconLock size={16} stroke={1.5} />} radius="md" />
                </Stack>
              )}

              {active === 1 && (
                <Stack gap="md">
                  <Group grow mb="md">
                    <Button variant={userType === 'PHARMACY' ? 'filled' : 'light'} color="teal" onClick={() => setUserType('PHARMACY')} leftSection={<IconBuilding size={16} />} radius="md">Pharmacy</Button>
                    <Button variant={userType === 'EXECUTIVE' ? 'filled' : 'light'} color="indigo" onClick={() => setUserType('EXECUTIVE')} leftSection={<IconUsers size={16} />} radius="md">Executive</Button>
                  </Group>

                  {userType === 'PHARMACY' && (
                    <Stack gap="md">
                      <TextInput label="Pharmacy Name" placeholder="Enter pharmacy name" required value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} error={pharmacyNameError} radius="md" />
                      <TextInput label="Pharmacy Address" placeholder="Enter full address" required value={pharmacyAddress} onChange={(e) => setPharmacyAddress(e.target.value)} error={pharmacyAddressError} radius="md" />
                      <TextInput label="Phone Number" placeholder="Enter phone number" required value={pharmacyPhone} onChange={(e) => setPharmacyPhone(e.target.value)} error={pharmacyPhoneError} radius="md" />
                      <TextInput label="License Number" placeholder="Enter license number" required value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} error={licenseNumberError} radius="md" />
                      <Group grow>
                        <TextInput label="Ward" placeholder="Enter ward" required value={ward} onChange={(e) => setWard(e.target.value)} error={wardError} radius="md" />
                        <Select
                          label="LGA"
                          placeholder="Select your LGA"
                          data={ogunLGAs}
                          required
                          value={lga}
                          onChange={setLga}
                          error={lgaError}
                          radius="md"
                        />
                      </Group>
                    </Stack>
                  )}
                </Stack>
              )}

              {active === 2 && (
                <Stack gap="md">
                  <Paper withBorder p="md" radius="md">
                    <Text fw={500} mb="xs">Account Information</Text>
                    <SimpleGrid cols={2} spacing="xs">
                      <Text size="sm" c="dimmed">First Name:</Text>
                      <Text size="sm">{firstName}</Text>
                      <Text size="sm" c="dimmed">Last Name:</Text>
                      <Text size="sm">{lastName}</Text>
                      <Text size="sm" c="dimmed">Email:</Text>
                      <Text size="sm">{email}</Text>
                      <Text size="sm" c="dimmed">Account Type:</Text>
                      <Text size="sm">{userType === 'PHARMACY' ? 'Pharmacy' : 'Executive'}</Text>
                    </SimpleGrid>
                  </Paper>

                  {userType === 'PHARMACY' && (
                    <Paper withBorder p="md" radius="md">
                      <Text fw={500} mb="xs">Pharmacy Information</Text>
                      <SimpleGrid cols={2} spacing="xs">
                        <Text size="sm" c="dimmed">Pharmacy Name:</Text>
                        <Text size="sm">{pharmacyName}</Text>
                        <Text size="sm" c="dimmed">Address:</Text>
                        <Text size="sm">{pharmacyAddress}</Text>
                        <Text size="sm" c="dimmed">Phone Number:</Text>
                        <Text size="sm">{pharmacyPhone}</Text>
                        <Text size="sm" c="dimmed">License Number:</Text>
                        <Text size="sm">{licenseNumber}</Text>
                        <Text size="sm" c="dimmed">Ward:</Text>
                        <Text size="sm">{ward}</Text>
                        <Text size="sm" c="dimmed">LGA:</Text>
                        <Text size="sm">{lga}</Text>
                      </SimpleGrid>
                    </Paper>
                  )}

                  <Checkbox label="I agree to the Terms of Service and Privacy Policy" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.currentTarget.checked)} mb="md" />
                </Stack>
              )}

              <Group justify="space-between" mt="xl">
                <Button variant="default" onClick={prevStep} disabled={active === 0}>Back</Button>
                {active < 2 ? (
                  <Button onClick={nextStep} color="teal">Next</Button>
                ) : (
                  <Button onClick={handleSubmit} color="teal" loading={loading} leftSection={<IconShieldLock size={16} />}>Complete Registration</Button>
                )}
              </Group>
            </Paper>
          </Box>
        </SimpleGrid>
      </Container>
    </PublicLayout>
  );
}