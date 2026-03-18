const express = require('express');
const { body } = require('express-validator');
const { protect, authorizeRoles } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const validateRequest = require('../middleware/validate');
const {
	getDashboardStats,
	getAllOrders,
	bulkUpdateOrderStatus,
	getAllProductsAdmin,
	createAdminProduct,
	updateAdminProduct,
	deleteAdminProduct,
	bulkUpdateProductStock,
} = require('../controllers/adminController');
const { updateOrderStatus } = require('../controllers/orderController');

const router = express.Router();

router.use(protect, authorizeRoles('admin'));

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

router.get('/dashboard', asyncHandler(getDashboardStats));
router.get('/orders', asyncHandler(getAllOrders));
router.patch('/orders/status-bulk', asyncHandler(bulkUpdateOrderStatus));
router.patch('/orders/:id/status', asyncHandler(updateOrderStatus));

router.get('/products', asyncHandler(getAllProductsAdmin));
router.patch(
	'/products/stock-bulk',
	[
		body('updates').isArray({ min: 1 }).withMessage('updates must be a non-empty array'),
		body('updates.*.productId').notEmpty().withMessage('productId is required'),
		body('updates.*.stock').isInt({ min: 0 }).withMessage('stock must be an integer >= 0'),
	],
	validateRequest,
	asyncHandler(bulkUpdateProductStock)
);
router.post('/products', productValidationRules, validateRequest, asyncHandler(createAdminProduct));
router.put('/products/:id', productValidationRules, validateRequest, asyncHandler(updateAdminProduct));
router.delete('/products/:id', asyncHandler(deleteAdminProduct));

module.exports = router;
