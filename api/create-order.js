const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { product_id, plan_type, amount, product_name, user_id, user_email } = req.body;

    // Validation
    if (!product_id || !plan_type || !amount || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (amount < 1 || amount > 100000) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Create order with SHORT receipt (max 40 chars)
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-10)}`, // ✅ SHORT receipt
      notes: {
        product_id: product_id,
        product_name: product_name,
        plan_type: plan_type,
        user_id: user_id,
        user_email: user_email
      }
    };

    console.log('Creating Razorpay order...', options.receipt);

    const order = await razorpay.orders.create(options);

    console.log('Order created successfully:', order.id);

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