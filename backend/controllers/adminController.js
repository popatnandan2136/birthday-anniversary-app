const Website = require('../models/Website');
const LicenseKey = require('../models/LicenseKey');
const User = require('../models/User');
const { generateSlug } = require('../utils/slugGenerator');
const { generateQRCode, generateQRCodeBase64 } = require('../utils/qrCodeGenerator');

// Create a new website (with license validation)
const createWebsite = async (req, res) => {
  try {
    const {
      type,
      title,
      personName,
      relation,
      ageCategory,
      ageGroup,
      date,
      message,
      template,
      imageUrl,
      expiresAt,
    } = req.body;

    const adminId = req.userId;

    // Validate required fields
    const requiredFields = [
      'type',
      'title',
      'personName',
      'relation',
      'ageCategory',
      'date',
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // Validate type
    if (!['birthday', 'anniversary'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "birthday" or "anniversary".',
      });
    }

    // Validate relation
    const validRelations = [
      'sister',
      'brother',
      'son',
      'daughter',
      'friend',
      'father',
      'mother',
      'wife',
      'husband',
    ];
    if (!validRelations.includes(relation)) {
      return res.status(400).json({
        success: false,
        message: `Invalid relation. Must be one of: ${validRelations.join(', ')}`,
      });
    }

    // GET ADMIN'S LICENSE KEY
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found.',
      });
    }

    // Find license key assigned to this admin
    const licenseKey = await LicenseKey.findOne({
      assignedTo: adminId,
      status: 'active',
    });

    if (!licenseKey) {
      return res.status(403).json({
        success: false,
        message: 'No active license key assigned. Contact your master administrator.',
      });
    }

    // Check if license is valid (not expired)
    if (!licenseKey.isValid) {
      return res.status(403).json({
        success: false,
        message: 'License key has expired.',
      });
    }

    // Check license limit
    if (licenseKey.usedCount >= licenseKey.maxWebsites) {
      return res.status(403).json({
        success: false,
        message: `Website limit reached. Maximum: ${licenseKey.maxWebsites}, Used: ${licenseKey.usedCount}`,
      });
    }

    // Generate slug
    const slug = generateSlug(personName);

    // Check if slug already exists
    const existingWebsite = await Website.findOne({ slug });
    if (existingWebsite) {
      return res.status(409).json({
        success: false,
        message: 'A website with this name already exists. Please use a different name.',
      });
    }

    // Generate QR code
    const publicUrl = `${process.env.BASE_URL}/public/website/${slug}`;
    const qrCodeBase64 = await generateQRCodeBase64(publicUrl);

    // Create website
    const newWebsite = new Website({
      adminId,
      keyId: licenseKey._id,
      type,
      title,
      personName,
      relation,
      ageCategory,
      ageGroup: ageGroup || 'N/A',
      date: new Date(date),
      message: message || '',
      template: template || 'default',
      imageUrl: imageUrl || null,
      slug,
      isActive: true,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      viewCount: 0,
      status: 'active',
      metadata: {
        qrCodeUrl: qrCodeBase64,
        createdAt: new Date(),
        lastEditedAt: new Date(),
      },
    });

    await newWebsite.save();

    // Increment license key usage
    licenseKey.usedCount += 1;
    await licenseKey.save();

    return res.status(201).json({
      success: true,
      message: 'Website created successfully.',
      data: {
        id: newWebsite._id,
        title: newWebsite.title,
        personName: newWebsite.personName,
        slug: newWebsite.slug,
        type: newWebsite.type,
        date: newWebsite.date,
        status: newWebsite.status,
        publicUrl: publicUrl,
        qrCode: newWebsite.metadata.qrCodeUrl,
      },
    });
  } catch (error) {
    console.error('Create website error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating website.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get admin's websites (paginated)
const getAdminWebsites = async (req, res) => {
  try {
    const adminId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // Filter by status (optional)

    const filter = { adminId };
    if (status) {
      filter.status = status;
    }

    const websites = await Website.find(filter)
      .populate('keyId', 'keyCode maxWebsites usedCount')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Website.countDocuments(filter);

    const publicUrl = process.env.BASE_URL || 'http://localhost:3000';
    const websitesWithUrl = websites.map((site) => ({
      id: site._id,
      title: site.title,
      personName: site.personName,
      type: site.type,
      relation: site.relation,
      date: site.date,
      status: site.status,
      isActive: site.isActive,
      viewCount: site.viewCount,
      slug: site.slug,
      publicUrl: `${publicUrl}/public/website/${site.slug}`,
      expiresAt: site.expiresAt,
      createdAt: site.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: websitesWithUrl,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get admin websites error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching websites.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get single website details
const getWebsiteDetails = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const adminId = req.userId;

    const website = await Website.findById(websiteId)
      .populate('keyId', 'keyCode maxWebsites usedCount')
      .populate('adminId', 'name email');

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found.',
      });
    }

    // Verify ownership
    if (website.adminId._id.toString() !== adminId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own websites.',
      });
    }

    const publicUrl = process.env.BASE_URL || 'http://localhost:3000';

    return res.status(200).json({
      success: true,
      data: {
        id: website._id,
        title: website.title,
        personName: website.personName,
        type: website.type,
        relation: website.relation,
        ageCategory: website.ageCategory,
        ageGroup: website.ageGroup,
        date: website.date,
        message: website.message,
        template: website.template,
        imageUrl: website.imageUrl,
        slug: website.slug,
        status: website.status,
        isActive: website.isActive,
        viewCount: website.viewCount,
        expiresAt: website.expiresAt,
        publicUrl: `${publicUrl}/public/website/${website.slug}`,
        qrCode: website.metadata?.qrCodeUrl,
        createdAt: website.createdAt,
      },
    });
  } catch (error) {
    console.error('Get website details error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching website details.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Update website
const updateWebsite = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const adminId = req.userId;
    const { title, message, imageUrl, template, expiresAt } = req.body;

    const website = await Website.findById(websiteId);

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found.',
      });
    }

    // Verify ownership
    if (website.adminId.toString() !== adminId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only edit your own websites.',
      });
    }

    // Update fields
    if (title) website.title = title;
    if (message !== undefined) website.message = message;
    if (imageUrl !== undefined) website.imageUrl = imageUrl;
    if (template) website.template = template;
    if (expiresAt !== undefined) {
      website.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    website.metadata.lastEditedAt = new Date();

    await website.save();

    return res.status(200).json({
      success: true,
      message: 'Website updated successfully.',
      data: {
        id: website._id,
        title: website.title,
        personName: website.personName,
        slug: website.slug,
      },
    });
  } catch (error) {
    console.error('Update website error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating website.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Delete website (set status to deleted, decrement license usage)
const deleteWebsite = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const adminId = req.userId;

    const website = await Website.findById(websiteId);

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found.',
      });
    }

    // Verify ownership
    if (website.adminId.toString() !== adminId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own websites.',
      });
    }

    // Mark as deleted
    website.status = 'deleted';
    website.isActive = false;
    await website.save();

    // Decrement license key usage
    if (website.keyId) {
      const licenseKey = await LicenseKey.findById(website.keyId);
      if (licenseKey && licenseKey.usedCount > 0) {
        licenseKey.usedCount -= 1;
        await licenseKey.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Website deleted successfully.',
    });
  } catch (error) {
    console.error('Delete website error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting website.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Toggle website active/inactive
const toggleWebsite = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const adminId = req.userId;

    const website = await Website.findById(websiteId);

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found.',
      });
    }

    // Verify ownership
    if (website.adminId.toString() !== adminId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only toggle your own websites.',
      });
    }

    website.isActive = !website.isActive;
    if (website.isActive) {
      website.status = 'active';
    } else {
      website.status = 'inactive';
    }

    await website.save();

    return res.status(200).json({
      success: true,
      message: `Website ${website.isActive ? 'activated' : 'deactivated'} successfully.`,
      data: {
        id: website._id,
        isActive: website.isActive,
        status: website.status,
      },
    });
  } catch (error) {
    console.error('Toggle website error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while toggling website.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get license key status for admin
const getKeyStatus = async (req, res) => {
  try {
    const adminId = req.userId;

    const licenseKey = await LicenseKey.findOne({
      assignedTo: adminId,
      status: 'active',
    });

    if (!licenseKey) {
      return res.status(404).json({
        success: false,
        message: 'No active license key assigned.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        keyCode: licenseKey.keyCode,
        totalAllowed: licenseKey.maxWebsites,
        used: licenseKey.usedCount,
        remaining: licenseKey.remaining,
        isValid: licenseKey.isValid,
        expiresAt: licenseKey.expiresAt,
        percentageUsed:
          Math.round((licenseKey.usedCount / licenseKey.maxWebsites) * 100) || 0,
      },
    });
  } catch (error) {
    console.error('Get key status error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching license key status.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  createWebsite,
  getAdminWebsites,
  getWebsiteDetails,
  updateWebsite,
  deleteWebsite,
  toggleWebsite,
  getKeyStatus,
};
