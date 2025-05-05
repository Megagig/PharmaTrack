import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

async function main() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      include: {
        pharmacy: true,
      },
    });

    console.log('Total users found:', users.length);
    
    // Print user details
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log('ID:', user.id);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('PharmacyId:', user.pharmacyId);
      
      if (user.pharmacy) {
        console.log('Pharmacy Name:', user.pharmacy.name);
        console.log('PCN License:', user.pharmacy.pcnLicenseNumber);
      }
    });
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
