// ============================================
// API: Create Razorpay Order
// File: api/create-order.js
// ============================================

const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { product_id, plan_type, amount, product_name, user_id, user_email } = req.body;

    // Validate required fields
    if (!product_id || !plan_type || !amount || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate amount (basic security check)
    if (amount < 1 || amount > 100000) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${user_id}_${Date.now()}`,
      notes: {
        product_id: product_id,
        product_name: product_name,
        plan_type: plan_type,
        user_id: user_id,
        user_email: user_email
      }
    };

    const order = await razorpay.orders.create(options);

    // Return order details
    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};