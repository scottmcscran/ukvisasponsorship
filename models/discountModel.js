const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "A discount must have a code"],
    unique: true,
    uppercase: true,
    trim: true,
  },
  percentage: {
    type: Number,
    required: [true, "A discount must have a percentage"],
    min: 1,
    max: 100,
  },
  stripeId: {
    type: String,
    required: [true, "A discount must have a Stripe Coupon ID"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Discount = mongoose.model("Discount", discountSchema);

module.exports = Discount;
