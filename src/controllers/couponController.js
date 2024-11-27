const Coupon = require('../models/Coupon');
const { applyCartWise, applyProductWise, applyBxGy } = require('../utils/couponEngine');

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCoupons = async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
};

exports.getCouponById = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
  res.json(coupon);
};

exports.deleteCoupon = async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: 'Coupon deleted' });
};

exports.applyCoupon = async (req, res) => {
  try {
    const cart = req.body.cart;
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });

    let result = { discount: 0 };
    if (coupon.type === 'cart-wise') result = applyCartWise(cart, coupon.details);
    if (coupon.type === 'product-wise') result = applyProductWise(cart, coupon.details);
    if (coupon.type === 'bxgy') result = applyBxGy(cart, coupon.details);

    res.json({ discount: result.discount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
