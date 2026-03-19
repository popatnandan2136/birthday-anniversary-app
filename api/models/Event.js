const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    personName: {
      type: String,
      required: [true, 'Person name is required'],
      trim: true,
      maxlength: [100, 'Person name cannot exceed 100 characters'],
    },
    eventType: {
      type: String,
      enum: ['birthday', 'anniversary'],
      required: [true, 'Event type is required'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    message: {
      type: String,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
      default: '',
    },
    templateType: {
      type: String,
      enum: ['sister-cute', 'elder-sister', 'brother', 'child-cartoon', 'default'],
      default: 'default',
    },
    imageUrl: {
      type: String,
      default: null,
    },
    publicUrl: {
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
    isPublic: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'deleted'],
      default: 'active',
    },
    metadata: {
      lastViewedAt: Date,
      lastEditedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
eventSchema.index({ userId: 1, status: 1 });
eventSchema.index({ slug: 1 });
eventSchema.index({ eventDate: 1 });

// Pre-save middleware to set publicUrl
eventSchema.pre('save', function (next) {
  if (!this.publicUrl) {
    this.publicUrl = `${process.env.FRONTEND_URL}/wish/${this.slug}`;
  }
  this.metadata.lastEditedAt = new Date();
  next();
});

module.exports = mongoose.model('Event', eventSchema);
