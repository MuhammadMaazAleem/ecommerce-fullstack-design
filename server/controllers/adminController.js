const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  const [
    totalUsers,
    totalOrders,
    lowStockProducts,
    revenueResult,
    statusBreakdown,
    topProducts,
    recentOrders,
    salesLast7Days,
  ] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments({ stock: { $lt: 10 } }),
    Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$total' } } }]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Product.find({}).sort({ sold: -1, rating: -1 }).limit(5).select('name sold stock category price'),
    Order.find({}).sort({ createdAt: -1 }).limit(8).populate('user', 'name email').select('status total createdAt user'),
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          sales: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const statusMap = statusBreakdown.reduce((acc, entry) => {
    acc[entry._id] = entry.count;
    return acc;
  }, {});

  return res.status(200).json({
    success: true,
    message: 'Admin analytics fetched successfully',
    data: {
      kpis: {
        totalUsers,
        totalOrders,
        lowStockProducts,
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
      },
      orderStatus: {
        Processing: statusMap.Processing || 0,
        Shipped: statusMap.Shipped || 0,
        Delivered: statusMap.Delivered || 0,
        Cancelled: statusMap.Cancelled || 0,
      },
      salesLast7Days,
      topProducts,
      recentOrders,
    },
  });
};

const getAllOrders = async (req, res) => {
  const { status = '', limit = 20, page = 1 } = req.query;
  const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const normalizedPage = Math.max(Number(page) || 1, 1);
  const skip = (normalizedPage - 1) * normalizedLimit;

  const filter = {};
  if (status) {
    filter.status = status;
  }

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(normalizedLimit)
      .populate('user', 'name email'),
    Order.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Admin orders fetched successfully',
    data: {
      items,
      pagination: {
        total,
        page: normalizedPage,
        limit: normalizedLimit,
        totalPages: Math.ceil(total / normalizedLimit) || 1,
      },
    },
  });
};

const bulkUpdateOrderStatus = async (req, res) => {
  const { orderIds = [], status } = req.body;

  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'orderIds must be a non-empty array',
      data: null,
    });
  }

  const allowedStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid order status supplied',
      data: null,
    });
  }

  const updateResult = await Order.updateMany(
    { _id: { $in: orderIds } },
    { $set: { status } }
  );

  return res.status(200).json({
    success: true,
    message: 'Bulk order status updated successfully',
    data: {
      matched: updateResult.matchedCount || 0,
      modified: updateResult.modifiedCount || 0,
      status,
    },
  });
};

const getAllProductsAdmin = async (req, res) => {
  const { page = 1, limit = 20, search = '', category = '' } = req.query;
  const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const normalizedPage = Math.max(Number(page) || 1, 1);
  const skip = (normalizedPage - 1) * normalizedLimit;

  const filter = {};
  if (category) {
    filter.category = { $regex: `^${category}$`, $options: 'i' };
  }
  if (search.trim()) {
    filter.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { brand: { $regex: search.trim(), $options: 'i' } },
      { category: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(normalizedLimit),
    Product.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Admin products fetched successfully',
    data: {
      items,
      pagination: {
        total,
        page: normalizedPage,
        limit: normalizedLimit,
        totalPages: Math.ceil(total / normalizedLimit) || 1,
      },
    },
  });
};

const createAdminProduct = async (req, res) => {
  const product = await Product.create(req.body);

  return res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
};

const updateAdminProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
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

const deleteAdminProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
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

const bulkUpdateProductStock = async (req, res) => {
  const { updates = [] } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'updates must be a non-empty array',
      data: null,
    });
  }

  const operations = updates
    .filter((entry) => entry?.productId && Number.isFinite(Number(entry.stock)) && Number(entry.stock) >= 0)
    .map((entry) => ({
      updateOne: {
        filter: { _id: entry.productId },
        update: { $set: { stock: Number(entry.stock) } },
      },
    }));

  if (operations.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid stock updates were supplied',
      data: null,
    });
  }

  const result = await Product.bulkWrite(operations);

  return res.status(200).json({
    success: true,
    message: 'Product stock updated successfully',
    data: {
      matched: result.matchedCount || 0,
      modified: result.modifiedCount || 0,
    },
  });
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  bulkUpdateOrderStatus,
  getAllProductsAdmin,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  bulkUpdateProductStock,
};
