const express = require('express');
const adminController = require('../controllers/adminController');
const uploadController = require('../controllers/uploadController');
const { isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const os = require('os');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(os.tmpdir(), 'birthday-uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Image Upload
router.post(
  '/upload-image',
  isAdmin,
  upload.single('file'), // 'file' matches the field name in frontend apiService.js
  uploadController.uploadImage
);

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
