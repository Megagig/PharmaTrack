import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
} from '@mantine/core';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../store/authStore';
import { authService } from '../services/authService';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserRole>('EXECUTIVE');

  // Check for success message from registration
  const message = location.state?.message;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call the authentication API
      const response = await authService.login({
        email,
        password,
      });

      // Update auth store with user data and token
      login(response.user, response.token);

      // Redirect based on user role
      if (
        response.user.role === 'EXECUTIVE' ||
        response.user.role === 'ADMIN'
      ) {
        navigate('/executive/dashboard');
      } else if (response.user.role === 'PHARMACY') {
        navigate('/pharmacy/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" mb="xl">
        Welcome to PharmaTrack
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleLogin}>
          {message && (
            <Alert color="green" mb="md">
              {message}
            </Alert>
          )}

          {error && (
            <Alert color="red" mb="md">
              {error}
            </Alert>
          )}

          <Stack mb="md">
            <Text fw={500} size="sm">
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
            />
          </Stack>

          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb="md"
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb="xl"
          />

          <Button fullWidth type="submit" loading={loading}>
            Sign in
          </Button>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt="md">
          Don't have an account?{' '}
          <Text component="a" href="/register" c="blue">
            Register here
          </Text>
        </Text>
      </Paper>
    </Container>
  );
}
