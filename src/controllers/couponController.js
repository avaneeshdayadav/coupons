const Coupon = require('../models/Coupon');
const { applyCartWise, applyProductWise, applyBxGy } = require('../utils/couponEngine');
 
exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ error: "Coupon already exists." });
    }
    res.status(400).json({ error: err.message });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch coupons. " + err.message });
  }
};


exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated coupon
      runValidators: true, // Ensure validation of fields on the updated data
    });

    if (!updatedCoupon) {
      return res.status(404).json({ error: "Coupon not found." });
    }

    res.status(200).json(updatedCoupon);
  } catch (err) {
    res.status(400).json({ error: "Failed to update coupon. " + err.message });
  }
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


exports.getApplicableCoupons = async (req, res) => {
  try {
    const cart = req.body;

    if (!cart || !cart.items || cart.items.length === 0) {
      console.log(cart);
      return res.status(400).json({ error: "Cart is empty or invalid." });
    }

    // Fetch all available coupons
    const coupons = await Coupon.find();

    const applicableCoupons = coupons.map((coupon) => {
      let discount = 0;

      switch (coupon.type) {
        case "cart-wise":
          discount = applyCartWise(cart, coupon.details).discount;
          break;

        case "product-wise":
          discount = applyProductWise(cart, coupon.details).discount;
          break;

        case "bxgy":
          discount = applyBxGy(cart, coupon.details).discount;
          break;

        default:
          break;
      }

      return discount > 0
        ? {
            coupon_id: coupon._id,
            type: coupon.type,
            discount,
          }
        : null;
    }).filter(Boolean); // Remove null entries

    res.status(200).json({ applicable_coupons: applicableCoupons });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate applicable coupons. " + err.message });
  }
};
