const User = require('../models/User');
const LicenseKey = require('../models/LicenseKey');
const { generateLicenseKey } = require('../utils/licenseKeyGenerator');
const bcrypt = require('bcryptjs');

// Create a new admin
const createAdmin = async (req, res) => {
  try {
    const { email, password, name, phoneNumber } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required.',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists.',
      });
    }

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password,
      name,
      role: 'ADMIN',
      phoneNumber: phoneNumber || '',
      status: 'active',
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully.',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error('Create admin error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating admin.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update admin details
const updateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { password, name, phoneNumber, status } = req.body;

    // Check if admin exists
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found.',
      });
    }

    // Update fields
    if (name) admin.name = name;
    if (phoneNumber) admin.phoneNumber = phoneNumber;
    if (status) admin.status = status;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long.',
        });
      }
      admin.password = password;
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Admin updated successfully.',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phoneNumber: admin.phoneNumber,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error('Update admin error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating admin.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    // Prevent deleting self
    if (adminId === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account.',
      });
    }

    const admin = await User.findByIdAndDelete(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Admin deleted successfully.',
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting admin.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get all admins (paginated)
const getAllAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const admins = await User.find({ role: 'ADMIN' })
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ role: 'ADMIN' });

    return res.status(200).json({
      success: true,
      data: admins,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all admins error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching admins.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Create license key
const createLicenseKey = async (req, res) => {
  try {
    const { maxWebsites, assignedAdminId, expiresAt, notes } = req.body;

    // Validate input
    if (!maxWebsites || !assignedAdminId) {
      return res.status(400).json({
        success: false,
        message: 'maxWebsites and assignedAdminId are required.',
      });
    }

    if (maxWebsites < 1) {
      return res.status(400).json({
        success: false,
        message: 'maxWebsites must be at least 1.',
      });
    }

    // Check if admin exists
    const admin = await User.findById(assignedAdminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found.',
      });
    }

    // Generate unique license key code
    const keyCode = generateLicenseKey('BDAY');

    // Create license key
    const newKey = new LicenseKey({
      keyCode,
      maxWebsites,
      usedCount: 0,
      assignedTo: assignedAdminId,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      notes: notes || '',
      status: 'active',
    });

    await newKey.save();

    return res.status(201).json({
      success: true,
      message: 'License key created successfully.',
      data: {
        id: newKey._id,
        keyCode: newKey.keyCode,
        maxWebsites: newKey.maxWebsites,
        usedCount: newKey.usedCount,
        remaining: newKey.remaining,
        assignedTo: newKey.assignedTo,
        expiresAt: newKey.expiresAt,
        status: newKey.status,
      },
    });
  } catch (error) {
    console.error('Create license key error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating license key.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update license key
const updateLicenseKey = async (req, res) => {
  try {
    const { keyId } = req.params;
    const { maxWebsites, expiresAt, notes, status } = req.body;

    // Check if key exists
    const key = await LicenseKey.findById(keyId);
    if (!key) {
      return res.status(404).json({
        success: false,
        message: 'License key not found.',
      });
    }

    // Update fields
    if (maxWebsites !== undefined) {
      if (maxWebsites < key.usedCount) {
        return res.status(400).json({
          success: false,
          message: `Cannot reduce maxWebsites below ${key.usedCount} (current usage).`,
        });
      }
      key.maxWebsites = maxWebsites;
    }

    if (expiresAt !== undefined) {
      key.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    if (notes !== undefined) key.notes = notes;
    if (status) key.status = status;

    await key.save();

    return res.status(200).json({
      success: true,
      message: 'License key updated successfully.',
      data: {
        id: key._id,
        keyCode: key.keyCode,
        maxWebsites: key.maxWebsites,
        usedCount: key.usedCount,
        remaining: key.remaining,
        assignedTo: key.assignedTo,
        expiresAt: key.expiresAt,
        status: key.status,
      },
    });
  } catch (error) {
    console.error('Update license key error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating license key.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Assign license key to admin
const assignKeyToAdmin = async (req, res) => {
  try {
    const { keyId, adminId } = req.body;

    // Validate input
    if (!keyId || !adminId) {
      return res.status(400).json({
        success: false,
        message: 'keyId and adminId are required.',
      });
    }

    // Check if key exists
    const key = await LicenseKey.findById(keyId);
    if (!key) {
      return res.status(404).json({
        success: false,
        message: 'License key not found.',
      });
    }

    // Check if admin exists
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found.',
      });
    }

    // Unassign from previous admin if any
    if (key.assignedTo) {
      await LicenseKey.findByIdAndUpdate(keyId, { assignedTo: null });
    }

    // Assign to new admin
    key.assignedTo = adminId;
    await key.save();

    return res.status(200).json({
      success: true,
      message: 'License key assigned to admin successfully.',
      data: {
        id: key._id,
        keyCode: key.keyCode,
        assignedTo: key.assignedTo,
      },
    });
  } catch (error) {
    console.error('Assign key to admin error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while assigning license key.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Delete license key
const deleteLicenseKey = async (req, res) => {
  try {
    const { keyId } = req.params;

    const key = await LicenseKey.findByIdAndDelete(keyId);

    if (!key) {
      return res.status(404).json({
        success: false,
        message: 'License key not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'License key deleted successfully.',
    });
  } catch (error) {
    console.error('Delete license key error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting license key.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get all license keys with usage stats (paginated)
const getAllLicenseKeys = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const keys = await LicenseKey.find()
      .populate('assignedTo', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await LicenseKey.countDocuments();

    // Add remaining count to each key
    const keysWithStats = keys.map((key) => ({
      id: key._id,
      keyCode: key.keyCode,
      maxWebsites: key.maxWebsites,
      usedCount: key.usedCount,
      remaining: key.remaining,
      assignedTo: key.assignedTo,
      expiresAt: key.expiresAt,
      status: key.status,
      isValid: key.isValid,
      createdAt: key.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: keysWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all license keys error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching license keys.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAllAdmins,
  createLicenseKey,
  updateLicenseKey,
  assignKeyToAdmin,
  deleteLicenseKey,
  getAllLicenseKeys,
};
