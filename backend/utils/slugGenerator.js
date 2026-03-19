const crypto = require('crypto');

// Generate unique slug for website
const generateSlug = (personName, websiteId = '') => {
  // Create slug from name
  const nameSlug = personName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 30); // Limit length

  // Add unique identifier
  const uniquePart = crypto
    .randomBytes(4)
    .toString('hex')
    .substring(0, 8);

  return `${nameSlug}-${uniquePart}`;
};

// Validate slug format
const isValidSlug = (slug) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 5 && slug.length <= 50;
};

module.exports = { generateSlug, isValidSlug };
