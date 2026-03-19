const express = require('express');
const masterAdminController = require('../controllers/masterAdminController');
const { isMasterAdmin } = require('../middleware/auth');

const router = express.Router();

// All endpoints require MASTER_ADMIN role

// Admin Management
router.post('/admin/create', isMasterAdmin, masterAdminController.createAdmin);
router.put(
  '/admin/update/:adminId',
  isMasterAdmin,
  masterAdminController.updateAdmin
);
router.delete(
  '/admin/delete/:adminId',
  isMasterAdmin,
  masterAdminController.deleteAdmin
);
router.get('/admin/all', isMasterAdmin, masterAdminController.getAllAdmins);

// License Key Management
router.post(
  '/key/create',
  isMasterAdmin,
  masterAdminController.createLicenseKey
);
router.put(
  '/key/update/:keyId',
  isMasterAdmin,
  masterAdminController.updateLicenseKey
);
router.post(
  '/key/assign',
  isMasterAdmin,
  masterAdminController.assignKeyToAdmin
);
router.delete(
  '/key/delete/:keyId',
  isMasterAdmin,
  masterAdminController.deleteLicenseKey
);
router.get('/key/all', isMasterAdmin, masterAdminController.getAllLicenseKeys);

module.exports = router;
