import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

// Initialize Prisma client
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seeding...');

    // Check if we can connect to the database
    console.log('Testing database connection...');
    await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Database connection successful!');

    // Create a pharmacy
    console.log('\nCreating pharmacy...');
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

    // Create a pharmacy user
    console.log('\nCreating pharmacy user...');
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

    // Create an executive user
    console.log('\nCreating executive user...');
    const executivePassword = await bcrypt.hash('executive123', 10);
    const executiveUser = await prisma.user.create({
      data: {
        email: 'executive@example.com',
        password: executivePassword,
        role: UserRole.EXECUTIVE,
      },
    });
    console.log('Executive user created:', executiveUser.email);

    // Create an admin user
    console.log('\nCreating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: adminPassword,
        role: UserRole.ADMIN,
      },
    });
    console.log('Admin user created:', adminUser.email);

    // Create a second pharmacy
    console.log('\nCreating second pharmacy...');
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
    console.log('Second pharmacy created:', pharmacy2.name);

    // Create a user for the second pharmacy
    console.log('\nCreating second pharmacy user...');
    const pharmacy2UserPassword = await bcrypt.hash('pharmacy456', 10);
    const pharmacy2User = await prisma.user.create({
      data: {
        email: 'medicare@example.com',
        password: pharmacy2UserPassword,
        role: UserRole.PHARMACY,
        pharmacyId: pharmacy2.id,
      },
    });
    console.log('Second pharmacy user created:', pharmacy2User.email);

    // Create a sample report for the first pharmacy
    console.log('\nCreating sample report...');
    const report = await prisma.report.create({
      data: {
        pharmacyId: pharmacy.id,
        reportDate: new Date(),
        patientsServed: 45,
        maleCount: 20,
        femaleCount: 25,
        childrenCount: 10,
        adultCount: 30,
        elderlyCount: 5,
        topMedications: ['Paracetamol', 'Amoxicillin', 'Ibuprofen'],
        commonAilments: ['Malaria', 'Typhoid', 'Common Cold'],
        adverseDrugReactions: 2,
        adverseReactionDetails: 'Mild skin rash from antibiotics',
        referralsMade: 3,
        immunizationsGiven: 5,
        healthEducationSessions: 2,
        bpChecks: 15,
        expiredDrugs: false,
        stockouts: true,
        supplyDelays: true,
        notes: 'Overall a busy month with increased patient visits',
      },
    });
    console.log('Sample report created for', pharmacy.name);

    console.log('\nDatabase seeding completed successfully!');
    console.log('\nLogin Credentials:');
    console.log('-------------------');
    console.log('Pharmacy User:');
    console.log('  Email: pharmacy@example.com');
    console.log('  Password: pharmacy123');
    console.log('\nSecond Pharmacy User:');
    console.log('  Email: medicare@example.com');
    console.log('  Password: pharmacy456');
    console.log('\nExecutive User:');
    console.log('  Email: executive@example.com');
    console.log('  Password: executive123');
    console.log('\nAdmin User:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
