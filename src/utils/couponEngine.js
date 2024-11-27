function applyCartWise(cart, couponDetails) {
    if (cart.total_price >= couponDetails.threshold) {
      const discount = (cart.total_price * couponDetails.discount) / 100;
      return { discount, type: 'cart-wise' };
    }
    return { discount: 0, type: 'cart-wise' };
  }
  
  function applyProductWise(cart, couponDetails) {
    const item = cart.items.find((i) => i.product_id === couponDetails.product_id);
    if (item) {
      const discount = (item.price * item.quantity * couponDetails.discount) / 100;
      return { discount, type: 'product-wise' };
    }
    return { discount: 0, type: 'product-wise' };
  }
  
  function applyBxGy(cart, couponDetails) {
    let applicable = 0;
    couponDetails.buy_products.forEach((buy) => {
      const item = cart.items.find((i) => i.product_id === buy.product_id);
      if (item) applicable += Math.floor(item.quantity / buy.quantity);
    });
  
    const maxApplications = Math.min(applicable, couponDetails.repetition_limit || Infinity);
    const getItems = couponDetails.get_products.slice(0, maxApplications);
    const discount = getItems.reduce((sum, get) => {
      const item = cart.items.find((i) => i.product_id === get.product_id);
      return sum + (item ? get.quantity * item.price : 0);
    }, 0);
  
    return { discount, type: 'bxgy' };
  }
  
  module.exports = { applyCartWise, applyProductWise, applyBxGy };
  