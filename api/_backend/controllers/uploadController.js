const { uploadImageToCloudinary } = require('../utils/uploadHandler');

// Upload single image to Cloudinary
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const { folder } = req.body;
    const imageUrl = await uploadImageToCloudinary(req.file.path, folder || 'general');

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl,
    });
  } catch (error) {
    console.error('Upload image error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
};

module.exports = {
  uploadImage,
};
