const express = require('express');
const {
  createCoupon,
  getCoupons,
  getCouponById,
  deleteCoupon,
  applyCoupon,
  updateCoupon,
  getApplicableCoupons
} = require('../controllers/couponController');

const router = express.Router();

router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.get('/coupons', getCoupons);
router.get('/coupons/:id', getCouponById);
router.delete('/coupons/:id', deleteCoupon);
router.post('/apply-coupon/:id', applyCoupon);
router.get('/applicable-coupons', getApplicableCoupons);

module.exports = router;
