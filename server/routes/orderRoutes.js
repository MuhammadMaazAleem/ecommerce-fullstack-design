const express = require('express');
const { body } = require('express-validator');
const asyncHandler = require('../middleware/asyncHandler');
const validateRequest = require('../middleware/validate');
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one order item is required'),
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Shipping full name is required'),
  body('shippingAddress.email').isEmail().withMessage('Shipping email is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Shipping phone is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('Shipping city is required'),
  body('shippingAddress.addressLine').trim().notEmpty().withMessage('Shipping address is required'),
  body('paymentMethod')
    .optional()
    .isIn(['Card', 'PayPal', 'Cash on Delivery'])
    .withMessage('Invalid payment method'),
];

router.use(protect);
router.get('/my', asyncHandler(getMyOrders));
router.post('/', orderValidation, validateRequest, asyncHandler(createOrder));
router.get('/:id', asyncHandler(getOrderById));
router.patch(
  '/:id/status',
  authorizeRoles('admin'),
  body('status').isIn(['Processing', 'Shipped', 'Delivered', 'Cancelled']).withMessage('Invalid order status'),
  validateRequest,
  asyncHandler(updateOrderStatus)
);

module.exports = router;
