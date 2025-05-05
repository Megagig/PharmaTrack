import { useState, useEffect } from 'react';
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
import { PasswordStrengthIndicator } from '../../components/forms/PasswordStrengthIndicator';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
  validatePhoneNumber,
  validateLicenseNumber,
  ValidationResult,
} from '../../utils/formValidation';
import { AnimatedElement } from '../../components/animations/AnimatedElement';
import { authService } from '../../services/authService';

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
  const [ward, setWard] = useState('');
  const [lga, setLga] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Form validation
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [pharmacyNameError, setPharmacyNameError] = useState('');
  const [pharmacyAddressError, setPharmacyAddressError] = useState('');
  const [pharmacyPhoneError, setPharmacyPhoneError] = useState('');
  const [licenseNumberError, setLicenseNumberError] = useState('');
  const [wardError, setWardError] = useState('');
  const [lgaError, setLgaError] = useState('');

  // Validate email on change
  useEffect(() => {
    if (email) {
      const result = validateEmail(email);
      setEmailError(result.errorMessage);
    } else {
      setEmailError('');
    }
  }, [email]);

  // Validate password on change
  useEffect(() => {
    if (password) {
      const result = validatePassword(password);
      setPasswordError(result.errorMessage);
    } else {
      setPasswordError('');
    }
  }, [password]);

  // Validate confirm password on change
  useEffect(() => {
    if (confirmPassword) {
      const result = validatePasswordMatch(password, confirmPassword);
      setConfirmPasswordError(result.errorMessage);
    } else {
      setConfirmPasswordError('');
    }
  }, [confirmPassword, password]);

  // Validate phone number on change
  useEffect(() => {
    if (pharmacyPhone) {
      const result = validatePhoneNumber(pharmacyPhone);
      setPharmacyPhoneError(result.errorMessage);
    } else {
      setPharmacyPhoneError('');
    }
  }, [pharmacyPhone]);

  // Validate license number on change
  useEffect(() => {
    if (licenseNumber) {
      const result = validateLicenseNumber(licenseNumber);
      setLicenseNumberError(result.errorMessage);
    } else {
      setLicenseNumberError('');
    }
  }, [licenseNumber]);

  const nextStep = () => {
    if (active === 0) {
      // Validate first step
      let hasErrors = false;

      // Validate required fields
      if (!firstName) {
        setFirstNameError('First name is required');
        hasErrors = true;
      }

      if (!lastName) {
        setLastNameError('Last name is required');
        hasErrors = true;
      }

      // Validate email
      const emailValidation = validateEmail(email);
      if (!email || !emailValidation.isValid) {
        setEmailError(emailValidation.errorMessage || 'Email is required');
        hasErrors = true;
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!password || !passwordValidation.isValid) {
        setPasswordError(
          passwordValidation.errorMessage || 'Password is required'
        );
        hasErrors = true;
      }

      // Validate password match
      const passwordMatchValidation = validatePasswordMatch(
        password,
        confirmPassword
      );
      if (!confirmPassword || !passwordMatchValidation.isValid) {
        setConfirmPasswordError(
          passwordMatchValidation.errorMessage || 'Confirm password is required'
        );
        hasErrors = true;
      }

      if (hasErrors) {
        setError('Please correct the errors before proceeding');
        return;
      }
    }

    if (active === 1 && userType === 'PHARMACY') {
      // Validate pharmacy details
      let hasErrors = false;

      // Validate required fields
      if (!pharmacyName) {
        setPharmacyNameError('Pharmacy name is required');
        hasErrors = true;
      }

      if (!pharmacyAddress) {
        setPharmacyAddressError('Pharmacy address is required');
        hasErrors = true;
      }

      // Validate phone number
      const phoneValidation = validatePhoneNumber(pharmacyPhone);
      if (!pharmacyPhone || !phoneValidation.isValid) {
        setPharmacyPhoneError(
          phoneValidation.errorMessage || 'Phone number is required'
        );
        hasErrors = true;
      }

      // Validate license number
      const licenseValidation = validateLicenseNumber(licenseNumber);
      if (!licenseNumber || !licenseValidation.isValid) {
        setLicenseNumberError(
          licenseValidation.errorMessage || 'License number is required'
        );
        hasErrors = true;
      }

      // Validate ward and LGA
      if (!ward) {
        setWardError('Ward is required');
        hasErrors = true;
      }

      if (!lga) {
        setLgaError('LGA is required');
        hasErrors = true;
      }

      if (hasErrors) {
        setError('Please correct the errors before proceeding');
        return;
      }
    }

    setError('');
    setActive((current) => (current < 2 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (userType === 'PHARMACY') {
        // Register as pharmacy
        const response = await authService.registerPharmacy({
          email,
          password,
          role: userType,
          pharmacy: {
            name: pharmacyName,
            pharmacistInCharge: `${firstName} ${lastName}`,
            pcnLicenseNumber: licenseNumber,
            phoneNumber: pharmacyPhone,
            email: email, // Using the same email for pharmacy and user
            address: pharmacyAddress,
            ward: ward,
            lga: lga,
          },
        });

        // Navigate to login page after successful registration
        navigate('/login', {
          state: {
            message: 'Pharmacy registration successful! Please log in.',
          },
        });
      } else {
        // Register as executive
        const response = await authService.register({
          email,
          password,
          role: userType,
        });

        // Navigate to login page after successful registration
        navigate('/login', {
          state: {
            message: 'Executive registration successful! Please log in.',
          },
        });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'An error occurred during registration'
      );
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
          <Stepper
            active={active}
            onStepClick={setActive}
            breakpoint="sm"
            mb="xl"
          >
            <Stepper.Step
              label="Account Details"
              description="Basic information"
            >
              <Stack>
                <AnimatedElement type="fadeInUp" delay={0.1}>
                  <Group grow>
                    <TextInput
                      label="First Name"
                      placeholder="John"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      error={firstNameError}
                    />
                    <TextInput
                      label="Last Name"
                      placeholder="Doe"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      error={lastNameError}
                    />
                  </Group>
                </AnimatedElement>

                <AnimatedElement type="fadeInUp" delay={0.2}>
                  <TextInput
                    label="Email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                  />
                </AnimatedElement>

                <AnimatedElement type="fadeInUp" delay={0.3}>
                  <PasswordInput
                    label="Password"
                    placeholder="Create a strong password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={passwordError}
                  />
                  <PasswordStrengthIndicator password={password} />
                </AnimatedElement>

                <AnimatedElement type="fadeInUp" delay={0.4}>
                  <PasswordInput
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={confirmPasswordError}
                  />
                </AnimatedElement>

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

            <Stepper.Step
              label="Organization Details"
              description="Your organization"
            >
              {userType === 'PHARMACY' ? (
                <Stack>
                  <AnimatedElement type="fadeInUp" delay={0.1}>
                    <TextInput
                      label="Pharmacy Name"
                      placeholder="Community Pharmacy"
                      required
                      value={pharmacyName}
                      onChange={(e) => setPharmacyName(e.target.value)}
                      error={pharmacyNameError}
                    />
                  </AnimatedElement>

                  <AnimatedElement type="fadeInUp" delay={0.2}>
                    <TextInput
                      label="Pharmacy Address"
                      placeholder="123 Health Street, City"
                      required
                      value={pharmacyAddress}
                      onChange={(e) => setPharmacyAddress(e.target.value)}
                      error={pharmacyAddressError}
                    />
                  </AnimatedElement>

                  <AnimatedElement type="fadeInUp" delay={0.3}>
                    <TextInput
                      label="Pharmacy Phone"
                      placeholder="08012345678"
                      description="Nigerian format: 0801234XXXX or +2348012345XXX"
                      required
                      value={pharmacyPhone}
                      onChange={(e) => setPharmacyPhone(e.target.value)}
                      error={pharmacyPhoneError}
                    />
                  </AnimatedElement>

                  <AnimatedElement type="fadeInUp" delay={0.4}>
                    <TextInput
                      label="PCN License Number"
                      placeholder="PCN12345"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      error={licenseNumberError}
                    />
                  </AnimatedElement>

                  <AnimatedElement type="fadeInUp" delay={0.5}>
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
                  </AnimatedElement>

                  <AnimatedElement type="fadeInUp" delay={0.6}>
                    <TextInput
                      label="Ward"
                      placeholder="Enter ward"
                      required
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      error={wardError}
                    />
                  </AnimatedElement>

                  <AnimatedElement type="fadeInUp" delay={0.7}>
                    <TextInput
                      label="Local Government Area (LGA)"
                      placeholder="Enter LGA"
                      required
                      value={lga}
                      onChange={(e) => setLga(e.target.value)}
                      error={lgaError}
                    />
                  </AnimatedElement>
                </Stack>
              ) : (
                <Stack>
                  <AnimatedElement type="fadeInUp" delay={0.1}>
                    <TextInput
                      label="Organization Name"
                      placeholder="Health Department"
                      required
                    />
                  </AnimatedElement>

                  <AnimatedElement type="fadeInUp" delay={0.2}>
                    <TextInput
                      label="Department"
                      placeholder="Pharmacy Oversight"
                      required
                    />
                  </AnimatedElement>

                  <AnimatedElement type="fadeInUp" delay={0.3}>
                    <TextInput
                      label="Position/Title"
                      placeholder="Director"
                      required
                    />
                  </AnimatedElement>

                  <AnimatedElement type="fadeInUp" delay={0.4}>
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
                  </AnimatedElement>
                </Stack>
              )}
            </Stepper.Step>

            <Stepper.Step label="Confirmation" description="Review and submit">
              <Stack>
                <AnimatedElement type="fadeInUp" delay={0.1}>
                  <Title order={4} mb="md">
                    Review Your Information
                  </Title>
                </AnimatedElement>

                <AnimatedElement type="fadeInUp" delay={0.2}>
                  <Paper withBorder p="md" radius="md" mb="md">
                    <Text fw={700} mb="xs">
                      Account Details
                    </Text>
                    <Text>
                      {firstName} {lastName}
                    </Text>
                    <Text>{email}</Text>
                    <Text>Account Type: {userType}</Text>
                  </Paper>
                </AnimatedElement>

                {userType === 'PHARMACY' && (
                  <AnimatedElement type="fadeInUp" delay={0.3}>
                    <Paper withBorder p="md" radius="md" mb="md">
                      <Text fw={700} mb="xs">
                        Pharmacy Details
                      </Text>
                      <Text>{pharmacyName}</Text>
                      <Text>{pharmacyAddress}</Text>
                      <Text>{pharmacyPhone}</Text>
                      <Text>License: {licenseNumber}</Text>
                      <Text>Ward: {ward}</Text>
                      <Text>LGA: {lga}</Text>
                    </Paper>
                  </AnimatedElement>
                )}

                <AnimatedElement type="fadeInUp" delay={0.4}>
                  <Checkbox
                    label={
                      <Text size="sm">
                        I agree to the{' '}
                        <Text
                          component={Link}
                          to="/terms"
                          c={theme.colors.blue[6]}
                          inherit
                        >
                          Terms of Service
                        </Text>{' '}
                        and{' '}
                        <Text
                          component={Link}
                          to="/privacy"
                          c={theme.colors.blue[6]}
                          inherit
                        >
                          Privacy Policy
                        </Text>
                      </Text>
                    }
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                  />
                </AnimatedElement>

                <AnimatedElement type="bounce" delay={0.5}>
                  <Button
                    fullWidth
                    onClick={handleSubmit}
                    loading={loading}
                    mt="md"
                    size="lg"
                  >
                    Complete Registration
                  </Button>
                </AnimatedElement>
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
