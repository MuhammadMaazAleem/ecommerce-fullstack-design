const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      default: () => randomUUID(),
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'Primary image is required'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
    },
    reviews: {
      type: Number,
      min: [0, 'Reviews cannot be negative'],
      default: 0,
    },
    sold: {
      type: Number,
      min: [0, 'Sold count cannot be negative'],
      default: 0,
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100'],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ name: 'text', description: 'text', category: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
