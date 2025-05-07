import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function seedUsers() {
  try {
    console.log('Starting database seeding...');

    // Create executive user
    const executivePassword = await bcrypt.hash('password123', 10);
    const executive = await prisma.user.upsert({
      where: { email: 'executive@example.com' },
      update: { password: executivePassword },
      create: {
        email: 'executive@example.com',
        password: executivePassword,
        role: 'EXECUTIVE',
      },
    });
    console.log('Executive user created/updated:', executive.email);

    // Create pharmacy
    const pharmacy = await prisma.pharmacy.upsert({
      where: { pcnLicenseNumber: 'PCN12345678' },
      update: {},
      create: {
        name: 'Test Pharmacy',
        pharmacistInCharge: 'John Doe',
        pcnLicenseNumber: 'PCN12345678',
        phoneNumber: '1234567890',
        email: 'pharmacy@example.com',
        address: '123 Main St',
        ward: 'Test Ward',
        lga: 'Test LGA',
      },
    });
    console.log('Pharmacy created/updated:', pharmacy.name);

    // Create pharmacy user
    const pharmacyPassword = await bcrypt.hash('password123', 10);
    const pharmacyUser = await prisma.user.upsert({
      where: { email: 'pharmacy@example.com' },
      update: { 
        password: pharmacyPassword,
        pharmacyId: pharmacy.id,
      },
      create: {
        email: 'pharmacy@example.com',
        password: pharmacyPassword,
        role: 'PHARMACY',
        pharmacyId: pharmacy.id,
      },
    });
    console.log('Pharmacy user created/updated:', pharmacyUser.email);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
