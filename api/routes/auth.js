const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me - Get current user
router.get('/me', verifyToken, authController.getCurrentUser);

// POST /api/auth/logout
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
