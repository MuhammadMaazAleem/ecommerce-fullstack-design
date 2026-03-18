const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

const ALLOWED_ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const resolveProduct = async (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const byObjectId = await Product.findById(identifier);
    if (byObjectId) {
      return byObjectId;
    }
  }

  return Product.findOne({ id: identifier });
};

const createOrder = async (req, res) => {
  const {
    items,
    shippingAddress,
    paymentMethod = 'Card',
  } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Order items are required',
      data: null,
    });
  }

  const normalizedItems = [];
  const stockUpdates = [];

  for (const item of items) {
    const quantity = Number(item.quantity) || 0;
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Each item quantity must be at least 1',
        data: null,
      });
    }

    const product = await resolveProduct(item.productId || item.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'One or more products do not exist',
        data: null,
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}`,
        data: null,
      });
    }

    normalizedItems.push({
      productId: product._id,
      name: product.name,
      quantity,
      price: product.price,
      image: product.image,
    });

    stockUpdates.push({ product, quantity });
  }

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 9.99 : 0;
  const tax = Number((subtotal * 0.14).toFixed(2));
  const total = Number((subtotal + shippingFee + tax).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    items: normalizedItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingFee,
    tax,
    total,
  });

  await Promise.all(
    stockUpdates.map(async ({ product, quantity }) => {
      product.stock = Math.max(product.stock - quantity, 0);
      await product.save();
    })
  );

  return res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: order,
  });
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: 'Orders fetched successfully',
    data: orders,
  });
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.productId', 'id name image brand category');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
      data: null,
    });
  }

  const isOwner = String(order.user._id) === String(req.user._id);
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. You cannot access this order',
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Order fetched successfully',
    data: order,
  });
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  if (!ALLOWED_ORDER_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order status',
      data: null,
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
      data: null,
    });
  }

  order.status = status;
  await order.save();

  return res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: order,
  });
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
