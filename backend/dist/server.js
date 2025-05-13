"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const client_1 = require("@prisma/client");
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const pharmacy_routes_1 = __importDefault(require("./routes/pharmacy.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const fda_routes_1 = __importDefault(require("./routes/fda.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Initialize Prisma client with minimal logging
exports.prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
// Middleware
app.use((0, cors_1.default)({
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
}));
// Log only non-GET requests in production
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production' || req.method !== 'GET') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Use minimal logging in production
if (process.env.NODE_ENV === 'production') {
    app.use((0, morgan_1.default)('tiny', {
        skip: (req) => req.method === 'GET', // Skip logging GET requests in production
    }));
}
else {
    app.use((0, morgan_1.default)('dev'));
}
// Basic routes
app.get('/', (req, res) => {
    res.send('PharmaTrack API is running');
});
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is healthy' });
});
// Test database connection
app.get('/api/db-test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userCount = yield exports.prisma.user.count();
        const dbUrl = process.env.DATABASE_URL || '';
        const dbConnectionInfo = ((_a = dbUrl.split('@')[1]) === null || _a === void 0 ? void 0 : _a.split('/')[0]) || 'Connection info hidden';
        res.status(200).json({
            status: 'connected',
            message: 'Database connection successful',
            connection: dbConnectionInfo,
            userCount,
        });
    }
    catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message,
        });
    }
}));
// Register routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/pharmacies', pharmacy_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use('/api/fda', fda_routes_1.default);
app.use('/api/health', health_routes_1.default);
app.use('/api/products', product_routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
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
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.prisma.$disconnect();
    process.exit(0);
}));
