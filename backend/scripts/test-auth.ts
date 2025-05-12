import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

async function testAuth() {
  try {
    console.log('Testing Authentication System...');
    console.log('================================');

    // Test login
    console.log('\n1. Testing Login:');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'password123',
    });

    if (loginResponse.status === 200 && loginResponse.data.token) {
      console.log('✅ Login successful');
      console.log('User details:', JSON.stringify(loginResponse.data.user, null, 2));
      
      // Store token for subsequent requests
      const token = loginResponse.data.token;
      
      // Test get current user
      console.log('\n2. Testing Get Current User:');
      const userResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (userResponse.status === 200) {
        console.log('✅ Get current user successful');
        console.log('User details:', JSON.stringify(userResponse.data, null, 2));
      }
      
      // If admin token is provided, test promotion
      if (process.env.ADMIN_TOKEN) {
        console.log('\n3. Testing User Promotion (Admin only):');
        const userIdToPromote = process.env.USER_ID_TO_PROMOTE;
        
        if (!userIdToPromote) {
          console.log('❌ No user ID provided for promotion test');
        } else {
          try {
            const promoteResponse = await axios.post(
              `${API_URL}/auth/promote-to-executive`,
              { userId: userIdToPromote },
              { headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` } }
            );
            
            if (promoteResponse.status === 200) {
              console.log('✅ User promotion successful');
              console.log('Promotion result:', JSON.stringify(promoteResponse.data, null, 2));
            }
          } catch (error: any) {
            console.log('❌ User promotion failed');
            console.log('Error:', error.response?.data || error.message);
          }
        }
      } else {
        console.log('\n3. Skipping User Promotion test (requires admin token)');
      }
    } else {
      console.log('❌ Login failed');
    }
  } catch (error: any) {
    console.error('Test failed with error:');
    console.error(error.response?.data || error.message);
  }
}

testAuth();
