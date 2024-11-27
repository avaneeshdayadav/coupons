const express = require('express');
const {
  createCoupon,
  getCoupons,
  getCouponById,
  deleteCoupon,
  applyCoupon,
} = require('../controllers/couponController');

const router = express.Router();

router.post('/coupons', createCoupon);
router.get('/coupons', getCoupons);
router.get('/coupons/:id', getCouponById);
router.delete('/coupons/:id', deleteCoupon);
router.post('/apply-coupon/:id', applyCoupon);

module.exports = router;
