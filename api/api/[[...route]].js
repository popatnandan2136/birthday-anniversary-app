/**
 * Vercel Serverless Catch-All API Handler
 * Handles all /api/* routes
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/database');
const authRoutes = require('../routes/auth');
const adminRoutes = require('../routes/admin');
const publicRoutes = require('../routes/public');
const masterAdminRoutes = require('../routes/masterAdmin');
const errorHandler = require('../middleware/errorHandler');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/public', publicRoutes);
app.use('/master', masterAdminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;
