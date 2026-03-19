const express = require('express');
const multer = require('multer');
const Event = require('../models/Event');
const { verifyToken, optionalAuth } = require('../middleware/auth');
const {
  validateEventCreate,
  handleValidationErrors,
} = require('../middleware/validation');
const generateSlug = require('../utils/generateSlug');
const { uploadImageToCloudinary, deleteImageFromCloudinary } = require('../utils/uploadHandler');
const path = require('path');
const os = require('os');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(os.tmpdir(), 'birthday-uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP allowed.'));
    }
  },
});

// Create event
router.post(
  '/create',
  verifyToken,
  upload.single('image'),
  validateEventCreate,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { personName, eventType, eventDate, message, templateType } = req.body;

      let imageUrl = null;

      // Upload image if provided
      if (req.file) {
        try {
          imageUrl = await uploadImageToCloudinary(req.file.path, eventType);
        } catch (uploadError) {
          return res.status(400).json({
            success: false,
            message: 'Image upload failed: ' + uploadError.message,
          });
        }
      }

      // Generate unique slug
      const slug = generateSlug(personName, req.userId);

      // Create event
      const event = new Event({
        userId: req.userId,
        personName,
        eventType,
        eventDate: new Date(eventDate),
        message: message || '',
        templateType: templateType || 'default',
        imageUrl,
        slug,
      });

      await event.save();

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: {
          event,
        },
      });
    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create event',
        error: error.message,
      });
    }
  }
);

// Get user's events
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user can only access their own events
    if (req.userId !== userId && req.userId !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to access these events',
      });
    }

    const events = await Event.find({
      userId,
      status: 'active',
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        events,
        count: events.length,
      },
    });
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve events',
      error: error.message,
    });
  }
});

// Get event by ID (with auth check)
router.get('/id/:eventId', verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user owns this event
    if (event.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to access this event',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        event,
      },
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve event',
      error: error.message,
    });
  }
});

// Get public event by slug (no auth required)
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    const event = await Event.findOne({
      slug,
      status: 'active',
      isPublic: true,
    }).populate('userId', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Increment view count
    event.viewCount += 1;
    event.metadata.lastViewedAt = new Date();
    await event.save();

    res.status(200).json({
      success: true,
      data: {
        event,
      },
    });
  } catch (error) {
    console.error('Get public event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve event',
      error: error.message,
    });
  }
});

// Update event
router.put(
  '/:eventId',
  verifyToken,
  upload.single('image'),
  validateEventCreate,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { personName, eventType, eventDate, message, templateType } = req.body;

      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }

      // Check ownership
      if (event.userId.toString() !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to update this event',
        });
      }

      // Update image if new one provided
      if (req.file) {
        // Delete old image if exists
        if (event.imageUrl) {
          await deleteImageFromCloudinary(event.imageUrl);
        }

        try {
          event.imageUrl = await uploadImageToCloudinary(req.file.path, eventType);
        } catch (uploadError) {
          return res.status(400).json({
            success: false,
            message: 'Image upload failed: ' + uploadError.message,
          });
        }
      }

      // Update fields
      event.personName = personName;
      event.eventType = eventType;
      event.eventDate = new Date(eventDate);
      event.message = message || '';
      event.templateType = templateType || 'default';
      event.metadata.lastEditedAt = new Date();

      await event.save();

      res.status(200).json({
        success: true,
        message: 'Event updated successfully',
        data: {
          event,
        },
      });
    } catch (error) {
      console.error('Update event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update event',
        error: error.message,
      });
    }
  }
);

// Delete event
router.delete('/:eventId', verifyToken, async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership
    if (event.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this event',
      });
    }

    // Delete image from Cloudinary
    if (event.imageUrl) {
      await deleteImageFromCloudinary(event.imageUrl);
    }

    // Soft delete
    event.status = 'deleted';
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message,
    });
  }
});

module.exports = router;
