import { useState, useEffect } from 'react';
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
  Box,
  Group,
  Divider,
  SimpleGrid,
  useMantineTheme,
  Flex,
  rem,
  Center,
  Anchor,
  useMantineColorScheme,
  Checkbox,
} from '@mantine/core';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { PublicLayout } from '../components/layout/PublicLayout';
import { IconAt, IconLock, IconLogin, IconMoon, IconSun, IconUsers, IconShieldLock, IconUserCheck } from '@tabler/icons-react';
import { LoadingAnimation } from '../components/animations/LoadingAnimation';
import { notifications } from '@mantine/notifications';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const theme = useMantineTheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Hide loading animation after 1.5 seconds and load saved email if available
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 1500);
    
    // Check for saved email in local storage
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    
    return () => clearTimeout(timer);
  }, []);
  
  const toggleColorScheme = () => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');

  // Get success message from location state
  const message = location.state?.message || '';

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      notifications.show({
        title: 'Error',
        message: 'Email and password are required',
        color: 'red',
      });
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Call the login API
      const response = await authService.login({
        email: email.trim(),
        password,
      });

      // Store login in local storage if remember me is checked
      if (rememberMe) {
        localStorage.setItem('email', email.trim());
      } else {
        localStorage.removeItem('email');
      }

      // Show success notification
      notifications.show({
        title: 'Login Successful',
        message: `Welcome back, ${email.split('@')[0]}!`,
        color: 'teal',
      });

      // Store user data in auth store
      login(response.user, response.token);

      // Redirect based on user role
      if (
        response.user.role === 'EXECUTIVE' ||
        response.user.role === 'ADMIN'
      ) {
        navigate('/executive/dashboard');
      } else if (response.user.role === 'PHARMACY') {
        navigate('/pharmacy/dashboard');
      } else {
        // Fallback for unknown roles
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = typeof error === 'string'
        ? error
        : 'Login failed. Please check your credentials.';
      
      setError(errorMessage);
      
      notifications.show({
        title: 'Authentication Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
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
      <Box
        style={{
          minHeight: '100vh',
          background: colorScheme === 'dark' 
            ? `linear-gradient(135deg, ${theme.colors.dark[9]} 0%, ${theme.colors.dark[7]} 100%)`
            : `linear-gradient(135deg, ${theme.colors.teal[0]} 0%, ${theme.colors.indigo[0]} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Color scheme toggle */}
        <Box pos="absolute" top={20} right={20} style={{ zIndex: 10 }}>
          <Button
            variant="subtle"
            size="sm"
            leftSection={colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
            onClick={toggleColorScheme}
          >
            {colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
        </Box>
        
        {/* Decorative elements */}
        <Box
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.colors.teal[5]}22 0%, ${theme.colors.indigo[5]}11 70%)`,
            top: '-250px',
            left: '-100px',
            zIndex: 0,
          }}
        />
        <Box
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.colors.indigo[5]}22 0%, ${theme.colors.teal[5]}11 70%)`,
            bottom: '-300px',
            right: '-200px',
            zIndex: 0,
          }}
        />
        
        <Container size="xl" py={80}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50}>
            {/* Brand section */}
            <Box pt={50} style={{ zIndex: 1 }}>
              <Flex align="center" gap="md" mb={30}>
                <Box
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: theme.radius.md,
                    background: `linear-gradient(135deg, ${theme.colors.teal[6]} 0%, ${theme.colors.indigo[7]} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 30,
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  P
                </Box>
                <Title
                  order={1}
                  c={colorScheme === 'dark' ? 'white' : 'dark'}
                  style={{
                    fontSize: rem(36),
                    fontWeight: 800,
                  }}
                >
                  PharmaTrack
                </Title>
              </Flex>
              
              <Title 
                order={2} 
                c={colorScheme === 'dark' ? 'white' : 'dark'}
                mb="xl"
                style={{
                  fontSize: rem(42),
                  lineHeight: 1.2,
                  fontWeight: 700,
                }}
              >
                Transforming Pharmacy Management
              </Title>
              
              <Text 
                c={colorScheme === 'dark' ? 'gray.4' : 'gray.7'} 
                size="xl" 
                maw={500} 
                mb={40}
                style={{
                  lineHeight: 1.6,
                }}
              >
                Access your dashboard, submit reports, and manage your pharmacy data all in one secure platform.
              </Text>
              
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb={50}>
                {[
                  { 
                    title: 'Unified Access', 
                    description: 'Single login for all users - pharmacy staff, executives, and administrators',
                    icon: <IconUsers size={24} stroke={1.5} />
                  },
                  { 
                    title: 'Secure Platform', 
                    description: 'Enterprise-grade security to protect your pharmacy data',
                    icon: <IconShieldLock size={24} stroke={1.5} />
                  },
                  { 
                    title: 'Role-Based Access', 
                    description: 'Permissions tailored to your role in the organization',
                    icon: <IconUserCheck size={24} stroke={1.5} />
                  },
                ].map((feature, index) => (
                  <Paper
                    key={index}
                    p="md"
                    radius="md"
                    withBorder={colorScheme === 'light'}
                    bg={colorScheme === 'dark' ? 'dark.8' : 'white'}
                    style={{
                      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    <Group mb={10}>
                      <Box 
                        style={{
                          borderRadius: theme.radius.md,
                          background: `linear-gradient(135deg, ${theme.colors.teal[5]} 0%, ${theme.colors.indigo[5]} 100%)`,
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Text fw={600}>{feature.title}</Text>
                    </Group>
                    <Text size="sm" c="dimmed">{feature.description}</Text>
                  </Paper>
                ))}
              </SimpleGrid>
            </Box>

            {/* Login Form */}
            <Box style={{ zIndex: 1 }}>
              <Paper 
                withBorder={colorScheme === 'light'}
                radius="lg" 
                p={40} 
                bg={colorScheme === 'dark' ? 'dark.7' : 'white'}
                style={{
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Title order={2} ta="center" mb={10}>
                  Welcome to PharmaTrack
                </Title>
                <Text ta="center" c="dimmed" mb={30}>
                  Sign in to access your dashboard
                </Text>

                {message && (
                  <Alert
                    color="teal"
                    mb="md"
                    onClose={() => navigate(location.pathname, { replace: true })}
                    radius="md"
                  >
                    {message}
                  </Alert>
                )}

                {error && (
                  <Alert 
                    color="red" 
                    mb="md" 
                    onClose={() => setError('')}
                    radius="md"
                    title="Authentication Error"
                  >
                    {error}
                  </Alert>
                )}

                {/* Login Form */}
                <Box component="form" onSubmit={handleSubmit}>
                  <TextInput
                    label="Email Address"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    mb="md"
                    size="md"
                    leftSection={<IconAt size={16} stroke={1.5} />}
                    radius="md"
                  />

                  <PasswordInput
                    label="Password"
                    placeholder="Your secure password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    mb="xl"
                    size="md"
                    leftSection={<IconLock size={16} stroke={1.5} />}
                    radius="md"
                  />

                  <Flex justify="space-between" align="center" mb="md">
                    <Checkbox
                      label="Remember me"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.currentTarget.checked)}
                      size="sm"
                    />
                    <Anchor component={Link} to="/forgot-password" size="sm">
                      Forgot password?
                    </Anchor>
                  </Flex>

                  <Button 
                    fullWidth 
                    type="submit" 
                    loading={loading} 
                    size="md"
                    color="teal"
                    leftSection={<IconLogin size={18} />}
                    radius="md"
                  >
                    Sign in
                  </Button>

                  <Divider label="Or" labelPosition="center" my="lg" />

                  <Group justify="center" mt="md">
                    <Text size="sm" c="dimmed">
                      Don't have an account?{' '}
                      <Anchor
                        component={Link}
                        to="/register"
                        fw={500}
                      >
                        Register here
                      </Anchor>
                    </Text>
                  </Group>

                  <Text size="xs" c="dimmed" ta="center" mt="sm">
                    By continuing, you agree to our{' '}
                    <Anchor component={Link} to="/terms" size="xs">
                      Terms of Service
                    </Anchor>{' '}
                    and{' '}
                    <Anchor component={Link} to="/privacy" size="xs">
                      Privacy Policy
                    </Anchor>
                  </Text>
                </Box>
              </Paper>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </PublicLayout>
  );
}
