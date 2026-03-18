const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

cartSchema.pre('save', function preSave(next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
