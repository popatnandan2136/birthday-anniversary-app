const crypto = require('crypto');

const generateSlug = (name, id) => {
  // Create slug from name
  const nameSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 30); // Limit length

  // Add unique identifier
  const uniquePart = crypto.randomBytes(4).toString('hex');
  
  return `${nameSlug}-${uniquePart}`;
};

module.exports = generateSlug;
