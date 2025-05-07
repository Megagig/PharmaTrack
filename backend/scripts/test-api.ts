import axios from 'axios';

async function testLoginAPI() {
  try {
    console.log('Testing login API endpoint...');

    const response = await axios.post(
      'http://localhost:5000/api/auth/login',
      {
        email: 'pharmacy@example.com',
        password: 'password123',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('API Login successful!');
    console.log('Status:', response.status);
    console.log('User:', response.data.user);
    console.log('Token:', response.data.token.substring(0, 20) + '...');

    return response.data;
  } catch (error: any) {
    console.error('API Login failed!');

    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Request config:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
      });
    } else {
      console.error('Error:', error);
    }
  }
}

testLoginAPI();
