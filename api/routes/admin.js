const express = require('express');
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

const router = express.Router();

// All endpoints require ADMIN or MASTER_ADMIN role

// Website Management
router.post(
  '/website/create',
  isAdmin,
  adminController.createWebsite
);
router.get(
  '/website/list',
  isAdmin,
  adminController.getAdminWebsites
);
router.get(
  '/website/:websiteId',
  isAdmin,
  adminController.getWebsiteDetails
);
router.put(
  '/website/:websiteId',
  isAdmin,
  adminController.updateWebsite
);
router.delete(
  '/website/:websiteId',
  isAdmin,
  adminController.deleteWebsite
);
router.put(
  '/website/toggle/:websiteId',
  isAdmin,
  adminController.toggleWebsite
);

// License Key Status
router.get(
  '/key/status',
  isAdmin,
  adminController.getKeyStatus
);

module.exports = router;
