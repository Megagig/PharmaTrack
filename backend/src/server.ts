import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth.routes';
import pharmacyRoutes from './routes/pharmacy.routes';
import reportRoutes from './routes/report.routes';
import fdaRoutes from './routes/fda.routes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const port = process.env.PORT || 5000;

// Initialize Prisma client with minimal logging
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5175',
    ], // Vite ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Log only non-GET requests in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production' || req.method !== 'GET') {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use minimal logging in production
if (process.env.NODE_ENV === 'production') {
  app.use(
    morgan('tiny', {
      skip: (req) => req.method === 'GET', // Skip logging GET requests in production
    })
  );
} else {
  app.use(morgan('dev'));
}

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
    const userCount = await prisma.user.count();
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
app.use('/api/fda', fdaRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any): void => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const server = app.listen(Number(port), '0.0.0.0', () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.log(`Server is also accessible at http://0.0.0.0:${port}`);
});

// Handle Prisma disconnect on app termination
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
