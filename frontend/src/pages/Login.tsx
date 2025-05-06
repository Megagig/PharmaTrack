import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  Box,
  Group,
  Divider,
  SimpleGrid,
  useMantineTheme,
} from '@mantine/core';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../store/authStore';
import { authService } from '../services/authService';
import { PublicLayout } from '../components/layout/PublicLayout';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const theme = useMantineTheme();

  // Initialize form state with empty strings
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserRole>('EXECUTIVE');

  // Get success message from location state
  const message = location.state?.message || '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({
        email: email.trim(),
        password,
      });

      login(response.user, response.token);

      if (
        response.user.role === 'EXECUTIVE' ||
        response.user.role === 'ADMIN'
      ) {
        navigate('/executive/dashboard');
      } else if (response.user.role === 'PHARMACY') {
        navigate('/pharmacy/dashboard');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid email or password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <Box
        py={50}
        style={{
          background: `linear-gradient(45deg, ${theme.colors.blue[7]} 0%, ${theme.colors.cyan[7]} 100%)`,
          minHeight: 'calc(100vh - 180px)',
        }}
      >
        <Container size="xl" style={{ position: 'relative' }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
            {/* Left side - Login Form */}
            <Paper withBorder radius="md" p={{ base: 'md', sm: 30 }} bg="white">
              <Title order={2} ta="center" mt="md" mb={30}>
                Welcome Back to PharmaTrack
              </Title>

              {message && (
                <Alert
                  color="green"
                  mb="md"
                  onClose={() => navigate(location.pathname, { replace: true })}
                >
                  {message}
                </Alert>
              )}

              {error && (
                <Alert color="red" mb="md" onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleLogin}>
                <Stack mb="md" mt="md">
                  <Text fw={500} size="sm" mb="xs">
                    Login As
                  </Text>
                  <SegmentedControl
                    value={userType}
                    onChange={(value) => setUserType(value as UserRole)}
                    data={[
                      { label: 'Executive', value: 'EXECUTIVE' },
                      { label: 'Pharmacy', value: 'PHARMACY' },
                    ]}
                    fullWidth
                    color="blue"
                  />
                </Stack>

                <TextInput
                  label="Email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  mb="md"
                  size="md"
                />

                <PasswordInput
                  form="login-form"
                  label="Password"
                  placeholder="Your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  mb="xl"
                  size="md"
                />

                <Button fullWidth type="submit" loading={loading} size="md">
                  Sign in
                </Button>

                <Divider label="Or" labelPosition="center" my="lg" />

                <Group justify="center" mt="md">
                  <Text size="sm" c="dimmed">
                    Don't have an account?{' '}
                    <Text
                      component={Link}
                      to="/register"
                      c={theme.colors.blue[6]}
                      fw={500}
                      style={{ textDecoration: 'none' }}
                    >
                      Register here
                    </Text>
                  </Text>
                </Group>

                <Text size="xs" c="dimmed" ta="center" mt="sm">
                  By continuing, you agree to our{' '}
                  <Text
                    component={Link}
                    to="/terms"
                    c={theme.colors.blue[6]}
                    inherit
                    style={{ textDecoration: 'none' }}
                  >
                    Terms of Service
                  </Text>{' '}
                  and{' '}
                  <Text
                    component={Link}
                    to="/privacy"
                    c={theme.colors.blue[6]}
                    inherit
                    style={{ textDecoration: 'none' }}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </form>
            </Paper>

            {/* Right side - Welcome Image and Text */}
            <Box display={{ base: 'none', md: 'block' }}>
              <Stack align="center" gap="xl" pt={50}>
                <Box
                  style={{
                    width: '100%',
                    maxWidth: 400,
                    height: 300,
                    borderRadius: theme.radius.md,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    background: theme.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="/src/assets/dashboard-preview.svg"
                    alt="PharmaTrack Dashboard Preview"
                    style={{
                      width: '90%',
                      height: '90%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
                <Text c="white" ta="center" size="xl" fw={500} mt="xl">
                  Welcome to the Future of Pharmacy Management
                </Text>
                <Text c="white" ta="center" size="md" maw={400} mx="auto">
                  Access your dashboard, submit reports, and manage your
                  pharmacy data all in one place.
                </Text>
              </Stack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </PublicLayout>
  );
}
