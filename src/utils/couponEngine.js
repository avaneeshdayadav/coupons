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
    
    // Calculate how many times the "buy" condition is satisfied
    couponDetails.buy_products.forEach((buy) => {
      const item = cart.items.find((i) => i.product_id === buy.product_id);
      if (item) applicable += Math.floor(item.quantity / buy.quantity);
    });
  
    const maxApplications = Math.min(applicable, couponDetails.repetition_limit || Infinity);
  
    // Sort "get" products by price in descending order
    const sortedGetProducts = couponDetails.get_products
      .map((get) => {
        const item = cart.items.find((i) => i.product_id === get.product_id);
        return item ? { ...get, price: item.price } : null;
      })
      .filter(Boolean) // removes any null, undefined, NAN values in array returned by map.
      .sort((a, b) => b.price - a.price);
  
    // Calculate the discount
    let discount = sortedGetProducts.slice(0, maxApplications).reduce((sum, get) => {
      return sum + get.quantity * get.price;
    }, 0);
  
    // Ensure the discount does not exceed the total cart price
    const totalCartPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (discount > totalCartPrice) {
      discount = totalCartPrice;
    }
  
    return { discount, type: 'bxgy' };
  }
  
  
  module.exports = { applyCartWise, applyProductWise, applyBxGy };
  