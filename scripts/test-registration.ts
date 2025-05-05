import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

async function testRegularRegistration() {
  try {
    console.log('\nTesting regular user registration...');
    
    const email = `test-user-${Date.now()}@example.com`;
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: UserRole.EXECUTIVE,
      },
    });
    
    console.log('✅ Registration successful!');
    console.log('User details:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    
    // Test login with the newly created user
    console.log('\nTesting login with newly created user...');
    
    // Find user by email
    const foundUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!foundUser) {
      console.log('❌ Login failed: User not found');
      return;
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    
    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password');
      return;
    }
    
    console.log('✅ Login successful!');
    
    return { success: true, user };
  } catch (error) {
    console.error('Error during regular registration test:', error);
    return { success: false, error };
  }
}

async function testPharmacyRegistration() {
  try {
    console.log('\nTesting pharmacy registration...');
    
    // Create pharmacy data
    const pharmacyData = {
      name: `Test Pharmacy ${Date.now()}`,
      pharmacistInCharge: 'Dr. Test Pharmacist',
      pcnLicenseNumber: `PCN${Date.now()}`,
      phoneNumber: '08011223344',
      email: `test-pharmacy-${Date.now()}@example.com`,
      address: 'Test Address',
      ward: 'Test Ward',
      lga: 'Test LGA',
    };
    
    // Create user data
    const userData = {
      email: `pharmacy-user-${Date.now()}@example.com`,
      password: 'pharmacy123',
    };
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create the pharmacy and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the pharmacy
      const pharmacy = await tx.pharmacy.create({
        data: pharmacyData,
      });
      
      // Create the user with pharmacy association
      const user = await tx.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          role: UserRole.PHARMACY,
          pharmacyId: pharmacy.id,
        },
      });
      
      return { pharmacy, user };
    });
    
    console.log('✅ Pharmacy registration successful!');
    console.log('Pharmacy details:');
    console.log('  ID:', result.pharmacy.id);
    console.log('  Name:', result.pharmacy.name);
    console.log('  PCN License:', result.pharmacy.pcnLicenseNumber);
    
    console.log('\nUser details:');
    console.log('  ID:', result.user.id);
    console.log('  Email:', result.user.email);
    console.log('  Role:', result.user.role);
    console.log('  PharmacyId:', result.user.pharmacyId);
    
    // Test login with the newly created pharmacy user
    console.log('\nTesting login with newly created pharmacy user...');
    
    // Find user by email
    const foundUser = await prisma.user.findUnique({
      where: { email: userData.email },
      include: {
        pharmacy: true,
      },
    });
    
    if (!foundUser) {
      console.log('❌ Login failed: User not found');
      return;
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(userData.password, foundUser.password);
    
    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password');
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('  Pharmacy:', foundUser.pharmacy?.name);
    
    return { success: true, result };
  } catch (error) {
    console.error('Error during pharmacy registration test:', error);
    return { success: false, error };
  }
}

async function main() {
  try {
    // Test regular registration
    await testRegularRegistration();
    
    // Test pharmacy registration
    await testPharmacyRegistration();
    
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
