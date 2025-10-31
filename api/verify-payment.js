// ============================================
// API: Verify Payment and Create Subscription
// File: api/verify-payment.js
// ============================================

const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key for admin access
);

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      product_id,
      plan_type,
      amount,
      product_name,
      user_id
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment details'
      });
    }

    // Step 1: Verify Razorpay signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Step 2: Calculate subscription dates
    const subscriptionDates = calculateSubscriptionDates(plan_type);

    // Step 3: Create subscription in database
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user_id,
        product_id: product_id,
        plan_type: plan_type,
        start_date: subscriptionDates.start_date,
        end_date: subscriptionDates.end_date,
        status: 'active',
        amount_paid: amount,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        razorpay_signature: razorpay_signature
      })
      .select()
      .single();

    if (subError) {
      throw new Error('Failed to create subscription: ' + subError.message);
    }

    // Step 4: Create purchase history record
    const { error: historyError } = await supabase
      .from('purchase_history')
      .insert({
        user_id: user_id,
        subscription_id: subscription.id,
        product_id: product_id,
        product_name: product_name,
        purchase_date: new Date().toISOString(),
        amount: amount,
        plan_type: plan_type,
        tenure_start: subscriptionDates.start_date,
        tenure_end: subscriptionDates.end_date,
        payment_status: 'success',
        razorpay_payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id
      });

    if (historyError) {
      console.error('Failed to create purchase history:', historyError);
      // Don't fail the whole transaction, just log it
    }

    // Step 5: Return success response
    return res.status(200).json({
      success: true,
      message: 'Payment verified and subscription created',
      subscription_id: subscription.id,
      end_date: subscription.end_date
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// Helper function to verify Razorpay signature
function verifyRazorpaySignature(orderId, paymentId, signature) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  
  // Create expected signature
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');
  
  // Compare signatures
  return expectedSignature === signature;
}

// Helper function to calculate subscription dates
function calculateSubscriptionDates(planType) {
  const startDate = new Date();
  const endDate = new Date();

  switch (planType) {
    case '7-day':
      endDate.setDate(endDate.getDate() + 7);
      break;
    case 'monthly':
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case 'quarterly':
      endDate.setMonth(endDate.getMonth() + 3);
      break;
    case 'half_yearly':
      endDate.setMonth(endDate.getMonth() + 6);
      break;
    case 'yearly':
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    default:
      throw new Error('Invalid plan type');
  }

  return {
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString()
  };
}