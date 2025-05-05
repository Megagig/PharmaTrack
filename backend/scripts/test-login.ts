import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

async function testLogin(email: string, password: string) {
  try {
    console.log(`\nTesting login for email: ${email}`);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        pharmacy: true,
      },
    });

    if (!user) {
      console.log('❌ Login failed: User not found');
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password');
      return;
    }

    // Generate JWT token (for demonstration)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        pharmacyId: user.pharmacyId || undefined,
      },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '1h' }
    );

    console.log('✅ Login successful!');
    console.log('User details:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    
    if (user.pharmacy) {
      console.log('  Pharmacy:', user.pharmacy.name);
    }
    
    console.log('  Token:', token.substring(0, 20) + '...');
    
    return { success: true, user, token };
  } catch (error) {
    console.error('Error during login test:', error);
    return { success: false, error };
  }
}

async function main() {
  try {
    // Test with valid credentials
    await testLogin('pharmacy@example.com', 'pharmacy123');
    
    // Test with invalid password
    await testLogin('pharmacy@example.com', 'wrongpassword');
    
    // Test with non-existent user
    await testLogin('nonexistent@example.com', 'password123');
    
    // Test executive login
    await testLogin('executive@example.com', 'executive123');
    
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
