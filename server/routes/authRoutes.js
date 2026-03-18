const express = require('express');
const { body } = require('express-validator');
const asyncHandler = require('../middleware/asyncHandler');
const validateRequest = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { register, login, getProfile, refresh, logout } = require('../controllers/authController');

const router = express.Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidation, validateRequest, asyncHandler(register));
router.post('/login', loginValidation, validateRequest, asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));
router.get('/me', protect, asyncHandler(getProfile));

module.exports = router;
