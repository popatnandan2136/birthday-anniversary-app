const express = require('express');
const publicController = require('../controllers/publicController');

const router = express.Router();

// No authentication required for these routes

// GET /api/public/website/:slug - Get single website by slug
router.get('/website/:slug', publicController.getPublicWebsite);

// GET /api/public/popular - Get popular websites
router.get('/popular', publicController.getPopularWebsites);

// GET /api/public/websites/:type - Get websites by type (birthday/anniversary)
router.get('/websites/:type', publicController.getWebsitesByType);

module.exports = router;
