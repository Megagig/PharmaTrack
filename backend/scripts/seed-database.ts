import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seeding...');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await prisma.user.deleteMany({});
    await prisma.pharmacy.deleteMany({});
    console.log('Existing data cleared.');

    // 1. Create a pharmacy
    console.log('Creating pharmacy...');
    const pharmacy = await prisma.pharmacy.create({
      data: {
        name: 'HealthPlus Pharmacy',
        pharmacistInCharge: 'Dr. John Doe',
        pcnLicenseNumber: 'PCN12345678',
        phoneNumber: '08012345678',
        email: 'healthplus@example.com',
        address: '123 Health Street',
        ward: 'Central Ward',
        lga: 'Lagos Mainland',
      },
    });
    console.log('Pharmacy created:', pharmacy.name);

    // 2. Create a pharmacy user
    const pharmacyUserPassword = await bcrypt.hash('pharmacy123', 10);
    const pharmacyUser = await prisma.user.create({
      data: {
        email: 'pharmacy@example.com',
        password: pharmacyUserPassword,
        role: UserRole.PHARMACY,
        pharmacyId: pharmacy.id,
      },
    });
    console.log('Pharmacy user created:', pharmacyUser.email);

    // 3. Create an executive user
    const executivePassword = await bcrypt.hash('executive123', 10);
    const executiveUser = await prisma.user.create({
      data: {
        email: 'executive@example.com',
        password: executivePassword,
        role: UserRole.EXECUTIVE,
      },
    });
    console.log('Executive user created:', executiveUser.email);

    // 4. Create an admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: adminPassword,
        role: UserRole.ADMIN,
      },
    });
    console.log('Admin user created:', adminUser.email);

    // 5. Create another pharmacy
    console.log('Creating another pharmacy...');
    const pharmacy2 = await prisma.pharmacy.create({
      data: {
        name: 'MediCare Pharmacy',
        pharmacistInCharge: 'Dr. Jane Smith',
        pcnLicenseNumber: 'PCN87654321',
        phoneNumber: '08087654321',
        email: 'medicare@example.com',
        address: '456 Medical Avenue',
        ward: 'Eastern Ward',
        lga: 'Lagos Island',
      },
    });
    console.log('Pharmacy created:', pharmacy2.name);

    // 6. Create a user for the second pharmacy
    const pharmacy2UserPassword = await bcrypt.hash('pharmacy456', 10);
    const pharmacy2User = await prisma.user.create({
      data: {
        email: 'medicare@example.com',
        password: pharmacy2UserPassword,
        role: UserRole.PHARMACY,
        pharmacyId: pharmacy2.id,
      },
    });
    console.log('Pharmacy user created:', pharmacy2User.email);

    console.log('\nDatabase seeding completed successfully!');
    console.log('\nLogin Credentials:');
    console.log('-------------------');
    console.log('Pharmacy User:');
    console.log('  Email: pharmacy@example.com');
    console.log('  Password: pharmacy123');
    console.log('\nExecutive User:');
    console.log('  Email: executive@example.com');
    console.log('  Password: executive123');
    console.log('\nAdmin User:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');
    console.log('\nSecond Pharmacy User:');
    console.log('  Email: medicare@example.com');
    console.log('  Password: pharmacy456');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
