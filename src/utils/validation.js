// Validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateMessage = (message) => {
  return message && message.trim().length >= 5;
};

export const validateDate = (date) => {
  return date && new Date(date) <= new Date();
};

export const validateThemeColor = (color) => {
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return colorRegex.test(color);
};

export const validateFileSize = (file, maxSizeMB) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

export const isValidImageFile = (file) => {
  return validateFileType(file, ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) &&
    validateFileSize(file, 10);
};

export const isValidVideoFile = (file) => {
  return validateFileType(file, ['video/mp4', 'video/webm', 'video/quicktime']) &&
    validateFileSize(file, 100);
};

export const isValidAudioFile = (file) => {
  return validateFileType(file, ['audio/mpeg', 'audio/wav', 'audio/ogg']) &&
    validateFileSize(file, 20);
};
