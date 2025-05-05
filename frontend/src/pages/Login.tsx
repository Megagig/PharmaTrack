import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserRole>('EXECUTIVE');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In a real implementation, this would call the API
      // For now, we'll simulate a successful login

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data (in real app, this would come from the API)
      const userData = {
        id: '1',
        email: email,
        role: userType,
        // Add pharmacyId for pharmacy users
        ...(userType === 'PHARMACY' ? { pharmacyId: '123' } : {}),
      };

      const token = 'mock-jwt-token';

      // Update auth store
      login(userData, token);

      // Redirect based on role
      if (userType === 'EXECUTIVE' || userType === 'ADMIN') {
        navigate('/executive/dashboard');
      } else if (userType === 'PHARMACY') {
        navigate('/pharmacy/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
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
          For demo purposes, any email/password combination will work. Select
          your role to access the appropriate dashboard.
        </Text>
      </Paper>
    </Container>
  );
}
