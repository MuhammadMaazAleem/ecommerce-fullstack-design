const express = require('express');
const { body } = require('express-validator');
const asyncHandler = require('../middleware/asyncHandler');
const validateRequest = require('../middleware/validate');
const {
  getCartBySession,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');

const router = express.Router();

const addValidationRules = [
  body('productId').trim().notEmpty().withMessage('productId is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
];

const updateValidationRules = [
  body('productId').trim().notEmpty().withMessage('productId is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

router.get('/:sessionId', asyncHandler(getCartBySession));
router.post('/:sessionId/add', addValidationRules, validateRequest, asyncHandler(addToCart));
router.put('/:sessionId/update', updateValidationRules, validateRequest, asyncHandler(updateCartItem));
router.delete('/:sessionId/remove/:productId', asyncHandler(removeCartItem));
router.delete('/:sessionId/clear', asyncHandler(clearCart));

module.exports = router;
