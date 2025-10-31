const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
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

    if (!product_id || !plan_type || !amount || !user_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const orderId = `UPI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const subscriptionDates = calculateSubscriptionDates(plan_type);

    const { data: order, error: orderError } = await supabase
      .from('purchase_history')
      .insert({
        user_id: user_id,
        product_id: product_id,
        product_name: product_name,
        purchase_date: new Date().toISOString(),
        amount: amount,
        plan_type: plan_type,
        tenure_start: subscriptionDates.start_date,
        tenure_end: subscriptionDates.end_date,
        payment_status: 'pending',
        payment_method: 'upi',
        verification_status: 'pending',
        razorpay_order_id: orderId
      })
      .select()
      .single();

    if (orderError) {
      throw new Error('Failed to create order: ' + orderError.message);
    }

    return res.status(200).json({
      success: true,
      order_id: orderId,
      amount: amount,
      purchase_history_id: order.id,
      message: 'UPI order created successfully'
    });

  } catch (error) {
    console.error('Create UPI order error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create UPI order',
      error: error.message
    });
  }
};

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