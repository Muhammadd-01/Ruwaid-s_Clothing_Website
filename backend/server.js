import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { seedDatabase, createSuperAdmin } from './config/seed.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load env vars
dotenv.config();

// Create Express app
const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Ruwaid's Clothing API is running",
        timestamp: new Date().toISOString()
    });
});

// API info
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Ruwaid's Clothing API",
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            products: '/api/products',
            brands: '/api/brands',
            categories: '/api/categories',
            cart: '/api/cart',
            orders: '/api/orders',
            admin: '/api/admin'
        }
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Create super admin
        await createSuperAdmin();

        // Seed database with dummy data
        await seedDatabase();

        // Start listening
        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🛍️  Ruwaid's Clothing API Server                        ║
║                                                           ║
║   ✅ Server running on port ${PORT}                         ║
║   ✅ MongoDB connected                                    ║
║   ✅ Super Admin ready                                    ║
║   ✅ Database seeded                                      ║
║                                                           ║
║   📍 API: http://localhost:${PORT}/api                      ║
║   📍 Health: http://localhost:${PORT}/api/health            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
