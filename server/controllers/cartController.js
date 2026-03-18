const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const populateCart = (query) => query.populate('items.productId', 'id name image price stock brand category');

const getOrCreateCart = async (sessionId) => {
  let cart = await populateCart(Cart.findOne({ sessionId }));

  if (!cart) {
    cart = await Cart.create({ sessionId, items: [] });
    cart = await populateCart(Cart.findById(cart._id));
  }

  return cart;
};

const resolveProduct = async (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const byObjectId = await Product.findById(identifier);
    if (byObjectId) {
      return byObjectId;
    }
  }

  return Product.findOne({ id: identifier });
};

const getCartBySession = async (req, res) => {
  const cart = await getOrCreateCart(req.params.sessionId);

  return res.status(200).json({
    success: true,
    message: 'Cart fetched successfully',
    data: cart,
  });
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const qty = Math.max(Number(quantity) || 1, 1);

  const product = await resolveProduct(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
      data: null,
    });
  }

  const cart = await getOrCreateCart(req.params.sessionId);
  const existing = cart.items.find((item) => String(item.productId._id) === String(product._id));

  const nextQty = existing ? existing.quantity + qty : qty;

  if (nextQty > product.stock) {
    return res.status(400).json({
      success: false,
      message: `Only ${product.stock} item(s) available in stock`,
      data: null,
    });
  }

  if (existing) {
    existing.quantity = nextQty;
    existing.price = product.price;
  } else {
    cart.items.push({
      productId: product._id,
      quantity: qty,
      price: product.price,
    });
  }

  await cart.save();
  const updated = await populateCart(Cart.findById(cart._id));

  return res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: updated,
  });
};

const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity);

  if (!qty || qty < 1) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be at least 1',
      data: null,
    });
  }

  const product = await resolveProduct(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
      data: null,
    });
  }

  if (qty > product.stock) {
    return res.status(400).json({
      success: false,
      message: `Only ${product.stock} item(s) available in stock`,
      data: null,
    });
  }

  const cart = await getOrCreateCart(req.params.sessionId);
  const item = cart.items.find((entry) => String(entry.productId._id) === String(product._id));

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item is not in cart',
      data: null,
    });
  }

  item.quantity = qty;
  item.price = product.price;

  await cart.save();
  const updated = await populateCart(Cart.findById(cart._id));

  return res.status(200).json({
    success: true,
    message: 'Cart item updated',
    data: updated,
  });
};

const removeCartItem = async (req, res) => {
  const targetProduct = await resolveProduct(req.params.productId);

  if (!targetProduct) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
      data: null,
    });
  }

  const cart = await getOrCreateCart(req.params.sessionId);
  const before = cart.items.length;
  cart.items = cart.items.filter((entry) => String(entry.productId._id) !== String(targetProduct._id));

  if (before === cart.items.length) {
    return res.status(404).json({
      success: false,
      message: 'Item is not in cart',
      data: null,
    });
  }

  await cart.save();
  const updated = await populateCart(Cart.findById(cart._id));

  return res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: updated,
  });
};

const clearCart = async (req, res) => {
  const cart = await getOrCreateCart(req.params.sessionId);
  cart.items = [];
  await cart.save();

  const updated = await populateCart(Cart.findById(cart._id));

  return res.status(200).json({
    success: true,
    message: 'Cart cleared successfully',
    data: updated,
  });
};

module.exports = {
  getCartBySession,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
