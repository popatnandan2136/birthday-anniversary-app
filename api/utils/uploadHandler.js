const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;

const uploadImageToCloudinary = async (filePath, folder = 'birthday-anniversary') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `birthday-anniversary/${folder}`,
      resource_type: 'auto',
      max_bytes: 5242880, // 5MB max
    });

    // Delete temporary file
    await fs.unlink(filePath);

    return result.secure_url;
  } catch (error) {
    // Clean up temp file on error
    try {
      await fs.unlink(filePath);
    } catch (e) {
      // File might not exist
    }
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    // Extract public ID from URL
    const urlParts = imageUrl.split('/');
    const fileWithExt = urlParts[urlParts.length - 1];
    const publicId = `birthday-anniversary/${fileWithExt.split('.')[0]}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error.message);
    // Don't throw, just log
  }
};

module.exports = {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
};
