const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const authenticate = require('../middleware/authenticate');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
  ],
  validateRequest,
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  authController.login
);

// GET /api/auth/me
router.get('/me', authenticate, authController.getMe);

module.exports = router;
