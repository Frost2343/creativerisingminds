  // ================= PAYMENTS.JS ===========================
  // PAYMENT SYSTEM - DUAL PAYMENT (UPI + RAZORPAY)
  // ============================================

  const RAZORPAY_KEY_ID = 'rzp_live_RV7hkF6AydCkRW';
  const UPI_ID = 'riazshaikh005@okicici';
  const RAZORPAY_FEE_PERCENTAGE = 2.5;
  const SUBSCRIPTION_FORM_URL = 'https://forms.gle/b7rRZh4wgtkrRMeH6'; // Subscription form URL
  const TRIAL_FORM_URL = 'https://forms.gle/AEP3WBx26qUyWLww5'; // 10-day plan form

  let currentPaymentDetails = null;
  // const PENDING_PURCHASE_KEY = 'pending_purchase';

  function storePendingPurchase(productId, planType, baseAmount, productName) {
    localStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify({
      productId: productId,
      planType: planType,
      baseAmount: baseAmount,
      productName: productName
    }));
  }

  function restoreBillingCycle(planType) {
    if (planType !== 'monthly' && planType !== 'yearly') return;
    if (typeof syncBillingRadios === 'function') {
      billingCycle = planType;
      syncBillingRadios(planType);
      if (typeof renderPricing === 'function') renderPricing();
    }
  }

  function scrollToPricingSection() {
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function resumePendingPurchase() {
    // OAuth callback in progress on this page — redirect will happen shortly
    if (window.location.hash && window.location.hash.includes('access_token')) return;

    const raw = localStorage.getItem(PENDING_PURCHASE_KEY);
    if (!raw || typeof getCurrentUser !== 'function' || !getCurrentUser()) return;

    try {
      const pending = JSON.parse(raw);
      localStorage.removeItem(PENDING_PURCHASE_KEY);
      restoreBillingCycle(pending.planType);
      scrollToPricingSection();
      setTimeout(function () {
        initPayment(pending.productId, pending.planType, pending.baseAmount, pending.productName);
      }, 200);
    } catch (err) {
      localStorage.removeItem(PENDING_PURCHASE_KEY);
    }
  }

  // ============================================
  // MAIN PAYMENT FUNCTION - Shows modal first
  // ============================================
  async function initPayment(productId, planType, baseAmount, productName) {
    if (!productId || productId.includes('PRODUCT_ID')) {
      alert('This indicator is not yet available for purchase. Please contact support.');
      return;
    }

    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

    if (!user) {
      storePendingPurchase(productId, planType, baseAmount, productName);
      if (typeof storeAuthReturnUrl === 'function') {
        storeAuthReturnUrl('index.html#pricing');
      }
      window.location.href = 'login.html?returnUrl=' + encodeURIComponent('index.html#pricing');
      return;
    }

    // Calculate Razorpay amount (with 2.5% fee)
    const razorpayAmount = Math.round(baseAmount * (1 + RAZORPAY_FEE_PERCENTAGE / 100));

    // Store payment details
    currentPaymentDetails = {
      productId,
      planType,
      baseAmount,
      razorpayAmount,
      productName,
      user
    };

    // Show payment selection modal
    showPaymentModal();
  }

  // ============================================
  // SHOW PAYMENT MODAL
  // ============================================
  function showPaymentModal() {
    const { baseAmount, razorpayAmount, productName, planType } = currentPaymentDetails;
    
    const modal = document.createElement('div');
    modal.className = 'payment-modal-overlay';
    modal.id = 'paymentModalOverlay';
    modal.innerHTML = `
      <div class="payment-modal">
        <button class="payment-modal-close" onclick="closePaymentModal()">×</button>
        
        <div class="payment-modal-header">
          <h2>Choose Payment Method</h2>
          <p>Select how you'd like to pay</p>
          <div class="payment-product-info">
            <p><strong>${productName}</strong></p>
            <p>${formatPlanType(planType)} Plan</p>
          </div>
        </div>

        <div class="payment-options">
          <!-- UPI Payment Option -->
          <div class="payment-option upi-option" onclick="selectUPIPayment()">
            <span class="payment-option-badge">💰 Best Price</span>
            <span class="payment-icon">📱</span>
            <h3 class="payment-method-title">UPI Payment</h3>
            <div class="payment-pricing">
              <span class="original-price">₹${baseAmount.toLocaleString()}</span>
              <p class="price-breakdown">Original Price</p>
            </div>
            <ul class="payment-features">
              <li>No extra charges</li>
              <li>Direct bank transfer</li>
              <li>GPay, PhonePe, Paytm</li>
            </ul>
            <button class="payment-action-btn">Pay via UPI</button>
          </div>

          <!-- Razorpay Payment Option -->
          <div class="payment-option razorpay-option" onclick="selectRazorpayPayment()">
            <span class="payment-option-badge">💳 All Methods</span>
            <span class="payment-icon">💳</span>
            <h3 class="payment-method-title">Razorpay</h3>
            <div class="payment-pricing">
              <span class="original-price">₹${razorpayAmount.toLocaleString()}</span>
              <p class="price-breakdown">
                Base: ₹${baseAmount.toLocaleString()} + 
                <span class="payment-fee">₹${(razorpayAmount - baseAmount)} (2.5% platform fee)</span>
              </p>
            </div>
            <ul class="payment-features">
              <li>Credit/Debit Cards</li>
              <li>Net Banking & Wallets</li>
              <li>EMI Options</li>
            </ul>
            <button class="payment-action-btn">Pay via Razorpay</button>
          </div>
        </div>

        <!-- UPI Instructions -->
        <div class="upi-instructions" id="upiInstructions">
          <h3 style="color: #00ffcc; margin-bottom: 15px;">Complete Your UPI Payment</h3>
          
          <div class="upi-id-display">
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 5px;">Pay to this UPI ID:</p>
            <p class="upi-id-text">${UPI_ID}</p>
            <button class="copy-upi-btn" onclick="copyUPIId(event)">📋 Copy UPI ID</button>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <p style="color: #cbd5e1; margin-bottom: 10px;">Or scan this QR code:</p>
            <img src="images/qrcode.jpeg" alt="UPI QR Code" style="max-width: 200px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.2);">
          </div>

          <div style="background: rgba(251, 191, 36, 0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #fbbf24;">
            <p style="color: #fbbf24; font-weight: 600; margin-bottom: 10px;">📝 Important Steps:</p>
            <ol style="color: #cbd5e1; font-size: 14px; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Pay exactly <strong style="color: #00ffcc;">₹${baseAmount}</strong></li>
              <li style="margin-bottom: 8px;">Take screenshot of payment</li>
              <li style="margin-bottom: 8px;">To receive access, please complete the Google Form with your details. This allows us to fetch your TradingView ID and enable your access</li>
              <li>Activation within 24 hours</li>
            </ol>
          </div>

          <button class="payment-action-btn" onclick="confirmUPIPayment(event)" style="background: linear-gradient(135deg, #4ade80, #22c55e); margin-top: 20px;">
            ✓ I've Paid - Open Form
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
  }
  // ============================================
  // CLOSE MODAL
  // ============================================
  function closePaymentModal() {
    const modal = document.getElementById('paymentModalOverlay');
    if (modal) {
      modal.remove();
      document.body.style.overflow = 'auto';
      currentPaymentDetails = null;
    }
  }

  // Close on overlay click
  document.addEventListener('click', function(e) {
    if (e.target && e.target.className === 'payment-modal-overlay') {
      closePaymentModal();
    }
  });

  // ============================================
  // SELECT UPI PAYMENT
  // ============================================
  function selectUPIPayment() {
    const instructions = document.getElementById('upiInstructions');
    instructions.classList.add('active');
    instructions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ============================================
  // COPY UPI ID
  // ============================================
  async function copyUPIId(event) {
    const btn = event.currentTarget;
    const originalText = btn.textContent;
    
    try {
      // Attempt to copy
      await navigator.clipboard.writeText(UPI_ID);
      
      // Success feedback
      btn.textContent = '✓ Copied!';
      btn.style.background = 'rgba(74, 222, 128, 0.2)';
      btn.style.color = '#fff';
      
      // Reset after 2 seconds
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = 'rgba(255, 255, 255, 0.1)';
      }, 2000);
      
    } catch (error) {
      console.error('Copy failed:', error);
      
      // Fallback: Select text for manual copy
      const tempInput = document.createElement('input');
      tempInput.value = UPI_ID;
      document.body.appendChild(tempInput);
      tempInput.select();
      
      try {
        document.execCommand('copy'); // Old browser fallback
        btn.textContent = '✓ Copied!';
      } catch (fallbackError) {
        alert('Please copy manually: ' + UPI_ID);
      }
      
      document.body.removeChild(tempInput);
    }
  }

  // ============================================
  // CONFIRM UPI PAYMENT & CREATE ORDER
  // ============================================
  async function confirmUPIPayment(event) {
    const { productId, planType, baseAmount, productName, user } = currentPaymentDetails;
    const btn = event.target;

    try {
      btn.textContent = 'Creating order...';
      btn.disabled = true;

      const response = await fetch('/api/create-upi-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify({
          product_id: productId,
          plan_type: planType,
          amount: baseAmount,
          product_name: productName,
          user_id: user.id,
          user_email: user.email
        })
      });

      const result = await response.json();

      if (result.success) {
        closePaymentModal();
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#4ade80,#22c55e);color:white;padding:30px;border-radius:15px;box-shadow:0 10px 40px rgba(0,0,0,0.3);z-index:10001;text-align:center;max-width:400px;';
        successMsg.innerHTML = `
          <div style="font-size:48px;margin-bottom:10px;">✓</div>
          <div style="font-size:20px;font-weight:600;margin-bottom:10px;">Order Created!</div>
          <div style="font-size:14px;opacity:0.9;">Opening Google Form...</div>
        `;
        document.body.appendChild(successMsg);

        setTimeout(() => {
          document.body.removeChild(successMsg);
          window.open(getFormUrl(planType), '_blank');
        }, 2000);

      } else {
        throw new Error(result.message || 'Failed to create order');
      }

    } catch (error) {
      console.error('UPI order error:', error);
      alert('Failed to create order: ' + error.message);
      btn.textContent = '✓ I\'ve Paid - Open Form';
      btn.disabled = false;
    }
  }

  // ============================================
  // SELECT RAZORPAY PAYMENT
  // ============================================
  async function selectRazorpayPayment() {
    const { productId, planType, razorpayAmount, productName, user } = currentPaymentDetails;

    try {
      closePaymentModal();

      const loadingMsg = document.createElement('div');
      loadingMsg.id = 'razorpayLoading';
      loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(15,23,42,0.98);color:white;padding:30px;border-radius:15px;box-shadow:0 10px 40px rgba(0,0,0,0.5);z-index:10001;text-align:center;';
      loadingMsg.innerHTML = '<div style="font-size:18px;">Initializing payment...</div>';
      document.body.appendChild(loadingMsg);

      const orderData = await createRazorpayOrder(productId, planType, razorpayAmount, productName);
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      document.body.removeChild(loadingMsg);

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: razorpayAmount * 100,
        currency: 'INR',
        name: 'Creative Rising Minds',
        description: `${productName} - ${formatPlanType(planType)}`,
        order_id: orderData.order_id,
        
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          emi: true,
          paylater: true
        },
        
        handler: function(response) {
          verifyPayment(response, productId, planType, razorpayAmount, productName);
        },
        
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email,
          contact: user.user_metadata?.phone || ''
        },
        
        notes: {
          product_id: productId,
          plan_type: planType,
          user_id: user.id
        },
        
        theme: {
          color: '#1f6f73'
        },
        
        modal: {
          ondismiss: function() {
            const loading = document.getElementById('razorpayLoading');
            if (loading) document.body.removeChild(loading);
          }
        }
      };

      const razorpay = new Razorpay(options);
      
      razorpay.on('payment.failed', function(response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
      });
      
      razorpay.open();

    } catch (error) {
      console.error('Razorpay error:', error);
      alert('Payment failed: ' + error.message);
      const loading = document.getElementById('razorpayLoading');
      if (loading) document.body.removeChild(loading);
    }
  }
  // ============================================
  // CREATE RAZORPAY ORDER
  // ============================================
  async function createRazorpayOrder(productId, planType, amount, productName) {
    const user = getCurrentUser();
    const token = getAccessToken();

    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: productId,
        plan_type: planType,
        amount: amount,
        product_name: productName,
        user_id: user.id,
        user_email: user.email
      })
    });

    return await response.json();
  }

  // ============================================
  // VERIFY RAZORPAY PAYMENT
  // ============================================
  async function verifyPayment(response, productId, planType, amount, productName) {
    const user = getCurrentUser();
    const token = getAccessToken();

    const loadingMsg = document.createElement('div');
    loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(15,23,42,0.98);color:white;padding:30px;border-radius:15px;box-shadow:0 10px 40px rgba(0,0,0,0.5);z-index:10001;text-align:center;';
    loadingMsg.innerHTML = '<div style="font-size:18px;">Verifying payment...</div>';
    document.body.appendChild(loadingMsg);

    try {
      const verifyResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          product_id: productId,
          plan_type: planType,
          amount: amount,
          product_name: productName,
          user_id: user.id
        })
      });

      const result = await verifyResponse.json();

      document.body.removeChild(loadingMsg);

      if (result.success) {
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:30px;border-radius:15px;box-shadow:0 10px 40px rgba(0,0,0,0.3);z-index:10000;text-align:center;min-width:300px;';
        successMsg.innerHTML = `
          <div style="font-size:48px;margin-bottom:10px;">🎉</div>
          <div style="font-size:20px;font-weight:600;margin-bottom:10px;">Payment Successful!</div>
          <div style="font-size:14px;opacity:0.9;">Please fill the form to activate your subscription</div>
          <div style="font-size:12px;margin-top:15px;opacity:0.7;">Opening Google Form...</div>
        `;
        document.body.appendChild(successMsg);

        setTimeout(() => {
          window.location.href = getFormUrl(planType);
        }, 2000);
      } else {
        throw new Error(result.message || 'Payment verification failed');
      }

    } catch (error) {
      if (document.body.contains(loadingMsg)) {
        document.body.removeChild(loadingMsg);
      }
      
      console.error('Verification error:', error);
      alert('Payment verification failed: ' + error.message + '\n\nPlease contact support with your payment ID: ' + response.razorpay_payment_id);
    }
  }

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  function formatPlanType(planType) {
    const map = {
      'monthly': 'Monthly',
      'quarterly': 'Quarterly',
      'half_yearly': 'Half-Yearly',
      'yearly': 'Yearly',
      '7-day': '7-Day'
    };
    return map[planType] || planType;
  }
  
  function getFormUrl(planType) {
    return planType === '7-day' ? TRIAL_FORM_URL : SUBSCRIPTION_FORM_URL;
  }

  // Expose payment functions globally for onclick handlers and pricing-cards.js
  window.initPayment = initPayment;
  window.closePaymentModal = closePaymentModal;
  window.selectUPIPayment = selectUPIPayment;
  window.selectRazorpayPayment = selectRazorpayPayment;
  window.copyUPIId = copyUPIId;
  window.confirmUPIPayment = confirmUPIPayment;
  window.resumePendingPurchase = resumePendingPurchase;
