/**
 * Vercel Entry Point - Direct Handler
 */
const express = require('express');
const cors = require('cors');

// Try to load the app and catch any require errors
let app;
try {
  // Use relative path from api/index.js to api/_backend/vercel-handler.js
  app = require('./_backend/vercel-handler');
} catch (error) {
  console.error('CRITICAL: Failed to load backend handler:', error);
  
  // Fallback app to report the error to the user/browser
  app = express();
  app.use(cors());
  app.all('*', (req, res) => {
    res.status(500).json({
      success: false,
      message: 'Critical Backend Load Error',
      error: error.message,
      stack: error.stack,
      path: __filename
    });
  });
}

module.exports = app;
