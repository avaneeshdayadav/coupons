const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["cart-wise", "product-wise", "bxgy"],
    required: true,
  },
  details: {
    type: Object,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// To make the records unique based on type & details instead of looking for duplicates first and then creating records. (optimization of create coupons api)
couponSchema.index({ type: 1, details: 1 }, { unique: true });

module.exports = mongoose.model("Coupon", couponSchema);
