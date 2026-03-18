const mongoose = require('mongoose');
const Product = require('../models/Product');

const buildProductFilters = (query) => {
  const filters = {};

  if (query.search) {
    filters.$text = { $search: query.search.trim() };
  }

  if (query.category) {
    filters.category = { $regex: `^${query.category}$`, $options: 'i' };
  }

  if (query.brand) {
    const brands = query.brand.split(',').map((entry) => entry.trim()).filter(Boolean);
    if (brands.length > 0) {
      filters.brand = { $in: brands.map((entry) => new RegExp(`^${entry}$`, 'i')) };
    }
  }

  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) {
      filters.price.$gte = Number(query.minPrice);
    }
    if (query.maxPrice) {
      filters.price.$lte = Number(query.maxPrice);
    }
  }

  if (query.rating) {
    filters.rating = { $gte: Number(query.rating) };
  }

  return filters;
};

const buildSort = (sortValue) => {
  switch (sortValue) {
    case 'price':
    case 'price_asc':
      return { price: 1, createdAt: -1 };
    case 'price_desc':
      return { price: -1, createdAt: -1 };
    case 'rating':
    case 'rating_desc':
      return { rating: -1, reviews: -1 };
    case 'rating_asc':
      return { rating: 1, reviews: -1 };
    case 'bestseller':
      return { sold: -1, rating: -1 };
    default:
      return { createdAt: -1 };
  }
};

const resolveProductLookup = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const byObjectId = await Product.findById(id);
    if (byObjectId) {
      return byObjectId;
    }
  }

  return Product.findOne({ id });
};

const getProducts = async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 9, 1), 50);
  const skip = (page - 1) * limit;

  const filters = buildProductFilters(req.query);
  const sort = buildSort(req.query.sort);

  const [products, total, brands] = await Promise.all([
    Product.find(filters).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filters),
    Product.distinct('brand', filters),
  ]);

  res.status(200).json({
    success: true,
    message: 'Products fetched successfully',
    data: {
      items: products,
      brands,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
  });
};

const getFeaturedProducts = async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 20);
  let products = await Product.find({ featured: true }).sort({ createdAt: -1 }).limit(limit);

  if (products.length === 0) {
    products = await Product.find({}).sort({ sold: -1, rating: -1 }).limit(limit);
  }

  res.status(200).json({
    success: true,
    message: 'Featured products fetched successfully',
    data: products,
  });
};

const getCategories = async (req, res) => {
  const categories = await Product.distinct('category');

  res.status(200).json({
    success: true,
    message: 'Categories fetched successfully',
    data: categories,
  });
};

const getProductById = async (req, res) => {
  const product = await resolveProductLookup(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
      data: null,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Product fetched successfully',
    data: product,
  });
};

const createProduct = async (req, res) => {
  const payload = req.body;
  const product = await Product.create(payload);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
};

const updateProduct = async (req, res) => {
  const product = await resolveProductLookup(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
      data: null,
    });
  }

  Object.assign(product, req.body);
  await product.save();

  return res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
};

const deleteProduct = async (req, res) => {
  const product = await resolveProductLookup(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
      data: null,
    });
  }

  await product.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: null,
  });
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
