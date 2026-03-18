const express = require('express');
const { body } = require('express-validator');
const asyncHandler = require('../middleware/asyncHandler');
const validateRequest = require('../middleware/validate');
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  getProducts,
  getFeaturedProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

const productValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('originalPrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  body('image').trim().notEmpty().withMessage('Image is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be 0 or greater'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  body('reviews').optional().isInt({ min: 0 }).withMessage('Reviews must be 0 or greater'),
  body('sold').optional().isInt({ min: 0 }).withMessage('Sold must be 0 or greater'),
  body('discount').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),
  body('featured').optional().isBoolean().withMessage('Featured must be true or false'),
  body('freeShipping').optional().isBoolean().withMessage('Free shipping must be true or false'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];

router.get('/', asyncHandler(getProducts));
router.get('/featured', asyncHandler(getFeaturedProducts));
router.get('/categories', asyncHandler(getCategories));
router.get('/:id', asyncHandler(getProductById));
router.post('/', protect, authorizeRoles('admin'), productValidationRules, validateRequest, asyncHandler(createProduct));
router.put('/:id', protect, authorizeRoles('admin'), productValidationRules, validateRequest, asyncHandler(updateProduct));
router.delete('/:id', protect, authorizeRoles('admin'), asyncHandler(deleteProduct));

module.exports = router;
