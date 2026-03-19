const { body, validationResult } = require('express-validator');

// Validation rules for registration
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
];

// Validation rules for login
const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Validation rules for event creation
const validateEventCreate = [
  body('personName').trim().notEmpty().withMessage('Person name is required'),
  body('eventType')
    .isIn(['birthday', 'anniversary'])
    .withMessage('Event type must be birthday or anniversary'),
  body('eventDate')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),
  body('templateType')
    .optional()
    .isIn(['sister-cute', 'elder-sister', 'brother', 'child-cartoon', 'default'])
    .withMessage('Invalid template type'),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateEventCreate,
  handleValidationErrors,
};
