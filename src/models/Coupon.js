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

module.exports = mongoose.model("Coupon", couponSchema);
