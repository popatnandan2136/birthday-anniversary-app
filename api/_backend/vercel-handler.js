/**
 * Vercel Serverless Function Handler
 * This file bridges the Express app to Vercel's serverless environment
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const masterAdminRoutes = require('./routes/masterAdmin');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

const app = express();

// Middleware
app.use(async (req, res, next) => {
  console.log(`[Backend Handler] REQUEST: ${req.method} ${req.url}`);
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('[Backend Handler] DB CONNECTION FAILED:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration - Allow all origins for debug
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/master', masterAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;
