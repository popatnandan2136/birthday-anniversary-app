const QRCode = require('qrcode');

// Generate QR code from URL
const generateQRCode = async (url, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(url, finalOptions);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

// Generate QR code as string (base64)
const generateQRCodeBase64 = async (url, options = {}) => {
  try {
    const buffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 2,
      width: 300,
    });

    return buffer.toString('base64');
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

// Validate URL for QR code
const isValidQRUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  generateQRCode,
  generateQRCodeBase64,
  isValidQRUrl,
};
