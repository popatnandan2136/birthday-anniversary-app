const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin ID is required'],
    },
    keyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LicenseKey',
      required: [true, 'License key is required'],
    },
    type: {
      type: String,
      enum: ['birthday', 'anniversary'],
      required: [true, 'Website type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    personName: {
      type: String,
      required: [true, 'Person name is required'],
      trim: true,
      maxlength: [50, 'Person name cannot exceed 50 characters'],
    },
    relation: {
      type: String,
      enum: [
        'sister',
        'brother',
        'son',
        'daughter',
        'friend',
        'father',
        'mother',
        'wife',
        'husband',
      ],
      required: [true, 'Relation is required'],
    },
    ageCategory: {
      type: String,
      enum: ['little', 'elder', 'child', 'teen', 'adult'],
      default: 'adult',
    },
    ageGroup: {
      type: String,
      enum: ['0-5', '5-10', '10-15', '15-18', '18+', 'N/A'],
      default: 'N/A',
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    message: {
      type: String,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
      default: '',
    },
    template: {
      type: String,
      required: [true, 'Template is required'],
      default: 'default',
    },
    imageUrl: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired', 'deleted'],
      default: 'active',
    },
    metadata: {
      lastViewedAt: Date,
      lastEditedAt: Date,
      qrCodeUrl: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
websiteSchema.index({ adminId: 1, status: 1 });
websiteSchema.index({ slug: 1 });
websiteSchema.index({ date: 1 });
websiteSchema.index({ expiresAt: 1 });

// Pre-save middleware to update status based on expiry
websiteSchema.pre('save', function (next) {
  if (this.expiresAt && new Date() > this.expiresAt) {
    this.status = 'expired';
    this.isActive = false;
  }
  this.metadata.lastEditedAt = new Date();
  next();
});

// Virtual to check if website is valid
websiteSchema.virtual('isValid').get(function () {
  if (!this.isActive) return false;
  if (this.status !== 'active') return false;
  if (this.expiresAt && new Date() > this.expiresAt) return false;
  return true;
});

module.exports = mongoose.model('Website', websiteSchema);
