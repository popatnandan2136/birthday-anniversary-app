// Generate URL-safe slug
export const generateSlug = (personName, date) => {
  const nameSlug = personName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `${nameSlug}-${randomId}`;
};

// Create unique slug ensuring it's URL-safe
export const createUniqueSlug = (personName) => {
  return generateSlug(personName, new Date());
};
