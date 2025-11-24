
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const orderPlacedTemplate = (orderData) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { padding: 30px; background: #f9f9f9; }
    .order-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border: 1px solid #ddd; }
    .item { padding: 10px 0; border-bottom: 1px solid #eee; }
    .item:last-child { border-bottom: none; }
    .total { font-size: 20px; font-weight: bold; color: #4CAF50; margin-top: 15px; padding-top: 15px; border-top: 2px solid #4CAF50; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #f0f0f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Order Confirmed!</h1>
    </div>
    <div class="content">
      <h2>Thank you for your order, ${orderData.shippingAddress.fullName}!</h2>
      <p>We've received your order and are processing it now.</p>
      
      <div class="order-box">
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${orderData.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString()}</p>
        
        <h4>Items Ordered:</h4>
        ${orderData.items.map(item => `
          <div class="item">
            <strong>${item.name}</strong><br>
            Quantity: ${item.quantity} × Rs. ${item.price.toFixed(2)} = Rs. ${(item.quantity * item.price).toFixed(2)}
          </div>
        `).join('')}

        <div class="item">
          Shpping Fee: Rs. ${orderData.shippingFee.toFixed(2)}
        </div>
        
        <div class="total">
          Total Amount: Rs. ${orderData.totalAmount.toFixed(2)}
        </div>
        
        <h4 style="margin-top: 20px;">Shipping Address:</h4>
        <p>
          ${orderData.shippingAddress.fullName} <br>
          ${orderData.shippingAddress.addressLine1}<br>
          ${orderData.shippingAddress.addressLine2}<br>
          ${orderData.shippingAddress.city},  ${orderData.shippingAddress.postalCode}<br>
          ${orderData.shippingAddress.phone}
        </p>
      </div>
      
      <p>Thanks for shopping with us.</p>
    </div>
    <div class="footer">
      <a href="${FRONTEND_URL}/shop/contactUs" style="color: #4CAF50; text-decoration: none;">
        Need Help? Contact Us!
      </a>
      <p>&copy; 2025 EasyCom</p>
    </div>
  </div>
</body>
</html>
`;

const orderDeliveredTemplate = (orderData) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { padding: 30px; background: #f9f9f9; }
    .success-box { background: white; padding: 30px; margin: 20px 0; border-radius: 5px; text-align: center; border: 2px solid #4CAF50; }
    .checkmark { font-size: 60px; color: #4CAF50; margin-bottom: 10px; }
    .button { display: inline-block; padding: 12px 30px; background: #FF9800; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #f0f0f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Order Delivered!</h1>
    </div>
    <div class="content">
      <h2>Hello ${orderData.shippingAddress.fullName},</h2>
      <p>Great news! Your order has been successfully delivered.</p>
      
      <div class="success-box">
        <div class="checkmark">✓</div>
        <h3>Delivery Confirmed</h3>
        <p><strong>Order ID:</strong> ${orderData.orderNumber}</p>
        <p><strong>Delivered on:</strong> ${new Date(orderData.updatedAt).toLocaleDateString()}</p>
        <p><strong>Delivered to:</strong><br>
          ${orderData.shippingAddress.fullName} <br>
          ${orderData.shippingAddress.addressLine1}<br>
          ${orderData.shippingAddress.addressLine2}<br>
          ${orderData.shippingAddress.city},  ${orderData.shippingAddress.postalCode}<br>
          ${orderData.shippingAddress.phone}
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <h3>How was your experience?</h3>
        <p>We'd love to hear your feedback!</p>
        <a href="${FRONTEND_URL}/shop/order/${orderData._id}/details" class="button">Leave a Review</a>
        <a href="${FRONTEND_URL}/shop/contactUs" style="color: #4CAF50; text-decoration: none;">
          Need Help? Contact Us!
        </a>
      </div>
      
      <p style="text-align: center;">Thank you for shopping with us! We hope to see you again soon.</p>
    </div>
    <div class="footer">
      <p>&copy;2025 EasyCom</p>
    </div>
  </div>
</body>
</html>
`;

export{orderPlacedTemplate,orderDeliveredTemplate}