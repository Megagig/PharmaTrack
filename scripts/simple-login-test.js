const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

// Initialize Prisma client
const prisma = new PrismaClient();

async function testLogin(email, password) {
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

    console.log('✅ Login successful!');
    console.log('User details:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    
    if (user.pharmacy) {
      console.log('  Pharmacy:', user.pharmacy.name);
    }
    
    return { success: true, user };
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
    
    // Test executive login
    await testLogin('executive@example.com', 'executive123');
    
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
