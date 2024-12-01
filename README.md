# **Coupons Management API for an E-commerce Website**

## **Overview**
This project is a RESTful API built with Express.js for managing and applying discount coupons for an e-commerce platform. The system supports various coupon types and allows for future extensibility.

---

## **Features**
1. **Coupon Types**:
   - **Cart-wise Coupons**: Discounts applied to the total cart value if specific conditions are met.
   - **Product-wise Coupons**: Discounts applied to specific products in the cart.
   - **BxGy Coupons**: "Buy X, Get Y Free" deals, with conditions and repetition limits.

2. **Endpoints**:
   - **CRUD Operations** for managing coupons.
   - Fetch applicable coupons and apply discounts to a cart.

3. **Extensible Design**: New coupon types can be added with minimal changes.

---

## **Endpoints**

| Method | Endpoint               | Description                                                         |
|--------|------------------------|---------------------------------------------------------------------|
| POST   | `/coupons`             | Creates a new coupon and will not allow to create duplicate coupons |
| GET    | `/coupons`             | Retrieve all coupons                                                |
| GET    | `/coupons/:id`         | Retrieve a specific coupon                                          |
| DELETE | `/coupons/:id`         | Delete a specific coupon                                            |
| PUT    | `/coupons/:id`         | Updates a specific coupon                                           |
| POST   | `/apply-coupon/:id`    | Apply a specific coupon to a cart and get discount                  |
| GET    | `/applicable-coupons`  | Get details of all the applicable coupons for a given cart          |

---

## **Implemented Use Cases**

### 1. **Cart-wise Coupons**
   - Example: *"10% off on carts over ₹100."*
   - **Logic**:
        - If the cart's total value exceeds the threshold, apply the discount to the total cart amount.
        - Maximum discount is 100% if discount exceeds the cart price.
   - **Status**: **Implemented**

### 2. **Product-wise Coupons**
   - Example: *"20% off on Product A."*
   - **Logic**:
        - If Product A exists in the cart, apply the discount to its price based on its quantity.
        - Maximum discount is 100% if discount exceeds the cart price.

   - **Status**: **Implemented**

### 3. **BxGy Coupons**
   - Example: *"Buy 2 of Product X, get 1 of Product Y free."*
   - **Logic**:
     - Count the eligible "buy" products.
     - Apply discounts for "get" products based on the repetition limit.
     - Applies the maximum discount possible by including expensive items for free from "get" product list.
     - Maximum discount is 100% if discount exceeds the cart price. 
   - **Status**: **Implemented**

---

## **Unimplemented Use Cases**

### 1. **Compound Coupons**
   - Combining multiple coupons in a single transaction (e.g., a cart-wise coupon and a product-wise coupon together).
   - **Reason**: Complex prioritization logic not implemented.

### 2. **Conditional BxGy Coupons**
   - Example: "Buy 3 of Product X and spend ₹500, get 2 of Product Y free."
   - **Reason**: Advanced conditions involving total cart value and product quantities are not supported.

### 3. **Coupon Prioritization**
   - Logic for choosing the best discount when multiple coupons are applicable.
   - **Reason**: Not prioritized in the current implementation.

### 4. **User-Specific Coupons**
   - Restricting coupons to specific users or user groups.
   - **Reason**: User management is not part of the current scope.

### 5. **Coupon Expiry**
   - Handling expiry dates and time-based conditions for coupons.
   - **Reason**: Not included in the MVP.

### 6. **Category-Wise Coupons**
   - Example providing 10% off on electronics.
   - **Reason**: Requires additional product metadata (like category) and category-based filtering.

### 7. **Referral Coupons**
   - Example flat ₹200 off if referred by an existing user.
   - **Reason**: Requires a referral tracking system and user-specific coupon generation.

### 8. **Time-Based Coupons**
   - Example 10% off for purchases made between 6 PM and 9 PM.
   - **Reason**: Requires time-tracking logic and validation based on current date/time.

### 9. **Coupon Expiry**
   - Handling expiry dates and time-based conditions for coupons.
   - **Reason**: Not included in the MVP.
---

## **Assumptions**
1. **Unique Product IDs**: Each product in the cart has a unique `product_id`.
2. **Disjoint Buy/Get Arrays**: For BxGy coupons, "buy" and "get" product sets do not overlap.
3. **Non-combinable Coupons**: Only one coupon can be applied to a cart at a time.
4. **Flat Discounts Only**: Coupons offer flat percentage or value-based discounts (e.g., no dynamic price reductions based on inventory). If discounts exceeds the cart price then maximum discount is equal to cart price (100%).
5. **Stateless Cart**: The cart details are passed with each request, and the server does not maintain a persistent cart state.
6. **No Tow Product-Wise Coupons With Same Product Id**: Each product-wise coupon in database has unique `product_id`. This is to prevent different discounts on same product.
---

## **Limitations**
1. **Coupon Overlap**: The system does not handle overlapping coupons or prioritize the best one for the user.
2. **Advanced Constraints**: No support for region-specific, user-specific, or conditional coupons based on external data.
3. **Performance**: For large carts or multiple coupons, the current implementation might be suboptimal.

---

## **Future Enhancements**
1. **Add Coupon Expiry**: Include validity dates for coupons.
2. **User-Specific Coupons**: Restrict coupons to specific users or membership tiers.
3. **Coupon Prioritization**: Handle conflicts and apply the most beneficial coupon automatically.
4. **Dynamic Constraints**: Add advanced constraints like product category-specific coupons, minimum quantity requirements, etc.
5. **Performance Optimization**: Optimize algorithms for large-scale e-commerce platforms.

---

## **Getting Started**

### Prerequisites
1. Node.js (v14+)
2. MongoDB (local or cloud)
3. npm or yarn

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/avaneeshdayadav/coupons.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Provide the mongodb connection string in environment variables in `.env` like below (This is example of cloud connection string):

   ```env
   MONGO_URI=mongodb+srv://your-username:your-password@YourclusterName.sia4t.mongodb.net/your-database-name?retryWrites=true&w=majority&appName=your-application-name
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Testing
Use **Postman** or **cURL** to test the API.

Postman collection is provided in the project. While using the collection, replace the port number in localhost url `http://localhost:3000` with you port number.

---

## **Example Request Body For Coupons & Cart**

**Cart Request Body**:
```json
{
  "items": [
    { "product_id": 1, "quantity": 6, "price": 200 },
    { "product_id": 2, "quantity": 4, "price": 100 },
    { "product_id": 3, "quantity": 2, "price": 50 }
  ],
  "total": 1200
}

```

**Product-wise Coupon Request Body**:
```json
{
  "type": "product-wise",
  "details": {
    "product_id": 2,
    "discount": 50
  }
}

```

**Cart-wise Coupon Request Body**:
```json
{
  "type": "cart-wise",
  "details": {
    "threshold": 100,
    "discount": 10
  }
}
```

**BxGy Coupon Request Body**:
```json
{
  "type": "bxgy",
  "details": {
    "buy_products": [
      { "product_id": 1, "quantity": 1 },
      { "product_id": 2, "quantity": 1 }
    ],
    "get_products": [
      { "product_id": 3, "quantity": 1 }
    ],
    "repetition_limit": 2
  }
}

```

---

## **License**
This project is licensed under the MIT License.