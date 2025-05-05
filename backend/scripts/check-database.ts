import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking database state...\n');

    // Check users
    const users = await prisma.user.findMany({
      include: {
        pharmacy: true,
      },
    });

    console.log(`Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log('  ID:', user.id);
      console.log('  Email:', user.email);
      console.log('  Role:', user.role);
      console.log('  PharmacyId:', user.pharmacyId || 'None');
      
      if (user.pharmacy) {
        console.log('  Pharmacy Name:', user.pharmacy.name);
        console.log('  PCN License:', user.pharmacy.pcnLicenseNumber);
      }
    });

    // Check pharmacies
    const pharmacies = await prisma.pharmacy.findMany();
    console.log(`\nFound ${pharmacies.length} pharmacies:`);
    pharmacies.forEach((pharmacy, index) => {
      console.log(`\nPharmacy ${index + 1}:`);
      console.log('  ID:', pharmacy.id);
      console.log('  Name:', pharmacy.name);
      console.log('  Pharmacist:', pharmacy.pharmacistInCharge);
      console.log('  PCN License:', pharmacy.pcnLicenseNumber);
      console.log('  Address:', pharmacy.address);
      console.log('  LGA:', pharmacy.lga);
    });

    // Check reports (if any)
    const reports = await prisma.report.findMany();
    console.log(`\nFound ${reports.length} reports.`);
    
    if (reports.length > 0) {
      reports.forEach((report, index) => {
        console.log(`\nReport ${index + 1}:`);
        console.log('  ID:', report.id);
        console.log('  Date:', report.reportDate);
        console.log('  Pharmacy ID:', report.pharmacyId);
        console.log('  Patients Served:', report.patientsServed);
      });
    }

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
