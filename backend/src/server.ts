import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth.routes';
import pharmacyRoutes from './routes/pharmacy.routes';
import reportRoutes from './routes/report.routes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const port = process.env.PORT || 5000;

// Initialize Prisma client
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Basic routes
app.get('/', (req: Request, res: Response): void => {
  res.send('PharmaTrack API is running');
});

app.get('/api/health', (req: Request, res: Response): void => {
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

// Test database connection
app.get('/api/db-test', async (req: Request, res: Response): Promise<void> => {
  try {
    // Try to count users as a simple database operation
    const userCount = await prisma.user.count();

    // Get database connection info (hiding sensitive parts)
    const dbUrl = process.env.DATABASE_URL || '';
    const dbConnectionInfo =
      dbUrl.split('@')[1]?.split('/')[0] || 'Connection info hidden';

    res.status(200).json({
      status: 'connected',
      message: 'Database connection successful',
      connection: dbConnectionInfo,
      userCount,
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any): void => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

// Handle Prisma disconnect on app termination
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
