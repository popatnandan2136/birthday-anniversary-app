const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} - Upload result with secure_url
 */
const uploadImage = async (filePath, folder = 'birthday-anniversary') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      size: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    };
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Image public ID
 * @returns {Promise<Object>} - Delete result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    return {
      success: result.result === 'ok',
      message: result.result === 'ok' ? 'Image deleted' : 'Failed to delete',
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      message: 'Failed to delete image',
      error: error.message,
    };
  }
};

/**
 * Get optimized image URL with transformations
 * @param {string} publicId - Image public ID
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized image URL
 */
const getOptimizedUrl = (publicId, options = {}) => {
  const {
    width = 300,
    height = 300,
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality,
    fetch_format: format,
    gravity,
    secure: true,
  });
};

/**
 * Upload from URL
 * @param {string} url - Image URL
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Object>} - Upload result
 */
const uploadFromUrl = async (url, folder = 'birthday-anniversary') => {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload from URL error:', error);
    return {
      success: false,
      message: 'Failed to upload image from URL',
      error: error.message,
    };
  }
};

/**
 * Generate responsive image URLs (for different screen sizes)
 * @param {string} publicId - Image public ID
 * @returns {Object} - URLs for different sizes
 */
const getResponsiveUrls = (publicId) => {
  return {
    thumbnail: getOptimizedUrl(publicId, { width: 150, height: 150 }),
    small: getOptimizedUrl(publicId, { width: 300, height: 300 }),
    medium: getOptimizedUrl(publicId, { width: 600, height: 600 }),
    large: getOptimizedUrl(publicId, { width: 1000, height: 1000 }),
    original: cloudinary.url(publicId, { secure: true }),
  };
};

module.exports = {
  uploadImage,
  deleteImage,
  getOptimizedUrl,
  uploadFromUrl,
  getResponsiveUrls,
};
