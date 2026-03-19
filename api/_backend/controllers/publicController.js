const Website = require('../models/Website');

// Get public website by slug (no auth required)
const getPublicWebsite = async (req, res) => {
  try {
    const { slug } = req.params;

    // Validate slug format
    if (!slug || slug.length < 5 || slug.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Invalid slug format.',
      });
    }

    // Find website by slug
    const website = await Website.findOne({ slug: slug.toLowerCase() });

    if (!website) {
      return res.status(404).json({
        success: false,
        message: 'Website not found.',
      });
    }

    // Check if website is publicly accessible
    if (!website.isActive || website.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Website is not accessible.',
      });
    }

    // Check if website has expired
    if (website.expiresAt && new Date() > website.expiresAt) {
      return res.status(403).json({
        success: false,
        message: 'Website has expired.',
      });
    }

    // Increment view count
    website.viewCount += 1;
    await website.save();

    // Return limited public data
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
        viewCount: website.viewCount,
      },
    });
  } catch (error) {
    console.error('Get public website error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching website.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get popular websites (public, no auth)
const getPopularWebsites = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const websites = await Website.find({
      isActive: true,
      status: 'active',
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
    })
      .select(
        'title personName type viewCount date slug template ageCategory relation'
      )
      .sort({ viewCount: -1 })
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: websites,
    });
  } catch (error) {
    console.error('Get popular websites error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching popular websites.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get websites by type (public, no auth)
const getWebsitesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // Validate type
    if (!['birthday', 'anniversary'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be "birthday" or "anniversary".',
      });
    }

    const websites = await Website.find({
      type,
      isActive: true,
      status: 'active',
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
    })
      .select(
        'title personName type viewCount date slug template ageCategory relation'
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Website.countDocuments({
      type,
      isActive: true,
      status: 'active',
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
    });

    return res.status(200).json({
      success: true,
      data: websites,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get websites by type error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching websites.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  getPublicWebsite,
  getPopularWebsites,
  getWebsitesByType,
};
