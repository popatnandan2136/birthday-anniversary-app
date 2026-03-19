const mongoose = require('mongoose');

const licenseKeySchema = new mongoose.Schema(
  {
    keyCode: {
      type: String,
      required: [true, 'Key code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    maxWebsites: {
      type: Number,
      required: [true, 'Max websites limit is required'],
      min: 1,
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Key must be assigned to an admin'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'revoked'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
licenseKeySchema.index({ assignedTo: 1 });
licenseKeySchema.index({ keyCode: 1 });
licenseKeySchema.index({ status: 1 });

// Virtual to check if key is valid
licenseKeySchema.virtual('isValid').get(function () {
  if (!this.isActive) return false;
  if (this.status !== 'active') return false;
  if (this.expiresAt && new Date() > this.expiresAt) return false;
  return true;
});

// Virtual to check remaining websites
licenseKeySchema.virtual('remaining').get(function () {
  return Math.max(0, this.maxWebsites - this.usedCount);
});

// Pre-save middleware to update status based on expiry
licenseKeySchema.pre('save', function (next) {
  if (this.expiresAt && new Date() > this.expiresAt) {
    this.status = 'expired';
  }
  next();
});

module.exports = mongoose.model('LicenseKey', licenseKeySchema);
