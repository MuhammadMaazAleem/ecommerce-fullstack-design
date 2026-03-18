/* eslint-disable no-console */
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const ensureSeedData = require('./ensureSeedData');

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    const result = await ensureSeedData();
    console.log(`Seed complete: inserted ${result.inserted} products`);
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

runSeed();
