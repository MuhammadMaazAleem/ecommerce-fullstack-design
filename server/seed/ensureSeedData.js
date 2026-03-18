const Product = require('../models/Product');
const { products } = require('./productsData');

const ensureSeedData = async () => {
  const existingCount = await Product.countDocuments();

  if (existingCount > 0) {
    return { inserted: 0, skipped: true };
  }

  const inserted = await Product.insertMany(products);
  return { inserted: inserted.length, skipped: false };
};

module.exports = ensureSeedData;
