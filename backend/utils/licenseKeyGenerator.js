const crypto = require('crypto');

// Generate a unique license key
const generateLicenseKey = (prefix = 'KEY') => {
  const randomPart = crypto.randomBytes(8).toString('hex').toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${randomPart}-${timestamp}`;
};

// Validate license key format
const isValidKeyFormat = (key) => {
  const keyRegex = /^[A-Z]+-[A-Z0-9]+-[A-Z0-9]+$/;
  return keyRegex.test(key);
};

// Generate batch of license keys
const generateKeyBatch = (count = 1, prefix = 'KEY') => {
  const keys = [];
  for (let i = 0; i < count; i++) {
    keys.push(generateLicenseKey(prefix));
  }
  return keys;
};

module.exports = {
  generateLicenseKey,
  isValidKeyFormat,
  generateKeyBatch,
};
