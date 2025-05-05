import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

async function testPrismaConnection() {
  console.log('Testing connection with Prisma Client...');
  const prisma = new PrismaClient();
  
  try {
    // Try a simple query
    await prisma.$queryRaw`SELECT 1 as result`;
    console.log('✅ Prisma connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Prisma connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function testDirectConnection() {
  console.log('\nTesting direct connection with pg...');
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    return false;
  }
  
  const pool = new Pool({
    connectionString: databaseUrl,
  });
  
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT 1 as result');
      console.log('✅ Direct connection successful!');
      console.log('Query result:', result.rows[0]);
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Direct connection failed:', error);
    return false;
  } finally {
    await pool.end();
  }
}

async function checkDatabaseUrl() {
  console.log('\nChecking DATABASE_URL format...');
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    return;
  }
  
  // Parse the connection string to check format
  try {
    // Hide password in logs
    const maskedUrl = databaseUrl.replace(
      /(postgresql:\/\/[^:]+:)([^@]+)(@.+)/,
      '$1*****$3'
    );
    console.log('Connection string format:', maskedUrl);
    
    // Check for required components
    if (!databaseUrl.startsWith('postgresql://')) {
      console.error('❌ URL should start with postgresql://');
    } else {
      console.log('✅ URL starts with postgresql://');
    }
    
    if (!databaseUrl.includes('@')) {
      console.error('❌ URL should contain @ symbol separating credentials and host');
    } else {
      console.log('✅ URL contains @ symbol');
    }
    
    if (!databaseUrl.includes('?')) {
      console.warn('⚠️ URL does not contain query parameters (like sslmode)');
    } else {
      console.log('✅ URL contains query parameters');
      
      if (databaseUrl.includes('sslmode=require')) {
        console.log('✅ URL includes sslmode=require');
      } else {
        console.warn('⚠️ URL does not include sslmode=require (might be needed for Neon)');
      }
    }
    
    // Extract host and port
    const hostMatch = databaseUrl.match(/@([^:\/]+)(:(\d+))?/);
    if (hostMatch) {
      const host = hostMatch[1];
      const port = hostMatch[3] || '5432';
      console.log(`Host: ${host}, Port: ${port}`);
    }
    
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
  }
}

async function main() {
  console.log('Database Connection Test\n');
  
  // Check the DATABASE_URL format
  await checkDatabaseUrl();
  
  // Test connections
  const prismaSuccess = await testPrismaConnection();
  const directSuccess = await testDirectConnection();
  
  console.log('\nSummary:');
  console.log(`Prisma Connection: ${prismaSuccess ? '✅ Success' : '❌ Failed'}`);
  console.log(`Direct Connection: ${directSuccess ? '✅ Success' : '❌ Failed'}`);
  
  if (!prismaSuccess && !directSuccess) {
    console.log('\nPossible issues:');
    console.log('1. The database server might be down or unreachable');
    console.log('2. Network connectivity issues (firewall, VPN, etc.)');
    console.log('3. Incorrect connection string');
    console.log('4. For Neon: Your IP might not be allowed to connect');
    
    console.log('\nSuggestions:');
    console.log('1. Check if your Neon database is active in the dashboard');
    console.log('2. Verify the connection string in your .env file');
    console.log('3. Check if your IP is allowed in Neon\'s IP restrictions');
    console.log('4. Try connecting from the Neon dashboard\'s SQL editor');
  }
}

main();
