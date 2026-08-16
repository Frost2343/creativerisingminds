/* ============================================================
   pricing-cards.js
   Data-driven pricing cards for Creative Rising Minds.
   Text uses translation keys from script.js (data-translate pattern).
   Buy Now → initPayment() in payments.js (auth check + payment modal).
   ============================================================ */

/** Section title colors — change these to customize heading appearance */
const PRICING_THEME = {
  individualTitleColor: '#00ffcc',
  comboTitleColor: '#00ffcc'
};

let billingCycle = 'yearly';

const INDIVIDUAL_PLANS = [
  {
    id: 'supreme',
    nameKey: 'pricing_card_supreme_name',
    fullNameKey: 'pricing_full_supreme',
    categoryKey: 'pricing_cat_scalping_confluence',
    icon: 'fa-bolt',
    accent: '#ff9800',
    productId: '95fc5173-6cf9-4476-864c-2aaa8ff952ab',
    annualMonthlyEff: 1100,
    annualTotal: 13200,
    monthlyPrice: 2750,
    page: 'ScalpUltraSupreme.html',
    popular: false,
    badgeKey: null,
    featureKeys: [
      // 'pricing_feat_supreme_1',
      // 'pricing_feat_supreme_2',
      // 'pricing_feat_supreme_3',
      // 'pricing_feat_supreme_4'
    ]
  },
  {
    id: 'flash',
    nameKey: 'pricing_card_flash_name',
    fullNameKey: 'pricing_full_flash',
    categoryKey: 'pricing_cat_options_live',
    icon: 'fa-bolt-lightning',
    accent: '#f472b6',
    productId: '2f9e70f0-3fa4-42fd-acb6-6a793afe86e9',
    annualMonthlyEff: 1100,
    annualTotal: 13200,
    monthlyPrice: 2750,
    page: 'FlashOptionChain.html',
    popular: false,
    badgeKey: null,
    featureKeys: [
      // 'pricing_feat_flash_1',
      // 'pricing_feat_flash_2',
      // 'pricing_feat_flash_3',
      // 'pricing_feat_flash_4',
      // 'pricing_feat_flash_5'
    ]
  },
  {
    id: 'ultimate',
    nameKey: 'pricing_card_ultimate_name',
    fullNameKey: 'pricing_full_ultimate',
    categoryKey: 'pricing_cat_scalping_swing',
    icon: 'fa-chart-line',
    accent: '#1e88e5',
    productId: 'd436086c-bf62-4a36-8faa-caed8e6da444',
    annualMonthlyEff: 900,
    annualTotal: 10800,
    monthlyPrice: 1,
    page: 'UltimateScalpPRO.html',
    popular: false,
    badgeKey: null,
    featureKeys: [
      // 'pricing_feat_ultimate_1',
      // 'pricing_feat_ultimate_2',
      // 'pricing_feat_ultimate_3',
      // 'pricing_feat_ultimate_4'
    ]
  },
  {
    id: 'twin',
    nameKey: 'pricing_card_twin_name',
    fullNameKey: 'pricing_full_twin',
    categoryKey: 'pricing_cat_multi_symbol',
    icon: 'fa-columns',
    accent: '#00ffcc',
    productId: '2486be6f-94ee-4c68-80ae-32cab4ba851f',
    annualMonthlyEff: 600,
    annualTotal: 7200,
    monthlyPrice: 1500,
    page: 'TwinChart.html',
    popular: false,
    badgeKey: null,
    featureKeys: [
      // 'pricing_feat_twin_1',
      // 'pricing_feat_twin_2',
      // 'pricing_feat_twin_3',
      // 'pricing_feat_twin_4'
    ]
  },
  {
    id: 'stocks-watch',
    nameKey: 'pricing_card_stocks_name',
    fullNameKey: 'pricing_full_stocks',
    categoryKey: 'pricing_cat_screener',
    icon: 'fa-eye',
    accent: '#a78bfa',
    productId: '6c214d71-5075-4fda-ae64-5618baff152e',
    annualMonthlyEff: 500,
    annualTotal: 6000,
    monthlyPrice: 1250,
    page: 'StocksWatch.html',
    popular: false,
    badgeKey: null,
    featureKeys: [
      // 'pricing_feat_stocks_1',
      // 'pricing_feat_stocks_2',
      // 'pricing_feat_stocks_3',
      // 'pricing_feat_stocks_4'
    ]
  },
  {
    id: 'mtf',
    nameKey: 'pricing_card_mtf_name',
    fullNameKey: 'pricing_full_mtf',
    categoryKey: 'pricing_cat_mtf',
    icon: 'fa-layer-group',
    accent: '#4facfe',
    productId: '976241cf-0723-4f71-bb02-94055eac2de5',
    annualMonthlyEff: 400,
    annualTotal: 4800,
    monthlyPrice: 1000,
    page: 'MTFDemandSupply.html',
    popular: false,
    badgeKey: null,
    featureKeys: [
      // 'pricing_feat_mtf_1',
      // 'pricing_feat_mtf_2',
      // 'pricing_feat_mtf_3',
      // 'pricing_feat_mtf_4'
    ]
  }
];

const COMBO_PLANS = [
  {
    id: 'all-in-one',
    nameKey: 'pricing_card_allinone_name',
    fullNameKey: 'pricing_full_allinone',
    categoryKey: 'pricing_cat_allinone',
    icon: 'fa-crown',
    accent: '#00ffcc',
    productId: '077f892d-52cc-490a-b501-34f2db17aecf',
    annualMonthlyEff: 1500,
    annualTotal: 18000,
    monthlyPrice: 3750,
    page: null,
    popular: true,
    badgeKey: 'pricing_badge_premium_choice',
    featureKeys: [
      // 'pricing_feat_allinone_1',
      // 'pricing_feat_allinone_2',
      // 'pricing_feat_allinone_3',
      // 'pricing_feat_allinone_4',
      // 'pricing_feat_allinone_5'
    ]
  },
  {
    id: 'combo1',
    nameKey: 'pricing_card_combo1_name',
    fullNameKey: 'pricing_full_combo1',
    categoryKey: 'pricing_cat_combo1',
    icon: 'fa-star',
    accent: '#ff9800',
    productId: '24b054f5-48c7-40cb-b56e-f83f6e0a1f45',
    annualMonthlyEff: 1300,
    annualTotal: 15600,
    monthlyPrice: 3250,
    page: null,
    popular: false,
    badgeKey: 'pricing_badge_most_popular',
    featureKeys: [
      // 'pricing_feat_combo1_1',
      // 'pricing_feat_combo1_2',
      // 'pricing_feat_combo1_3',
      // 'pricing_feat_combo1_4',
      // 'pricing_feat_combo1_5'
    ]
  },
  {
    id: 'combo2',
    nameKey: 'pricing_card_combo2_name',
    fullNameKey: 'pricing_full_combo2',
    categoryKey: 'pricing_cat_combo2',
    icon: 'fa-fire',
    accent: '#4facfe',
    productId: 'a4e2d335-ec7e-4080-9c12-2b58399eadb6',
    annualMonthlyEff: 1200,
    annualTotal: 14400,
    monthlyPrice: 3000,
    page: null,
    popular: false,
    badgeKey: null,
    featureKeys: [
      // 'pricing_feat_combo2_1',
      // 'pricing_feat_combo2_2',
      // 'pricing_feat_combo2_3',
      // 'pricing_feat_combo2_4',
      // 'pricing_feat_combo2_5'
    ]
  }
];

function t(key, fallback) {
  if (typeof getTranslation === 'function') {
    return getTranslation(key, fallback);
  }
  return fallback || key;
}

function formatINR(amount) {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildCard(plan, isAnnual) {
  const name = t(plan.nameKey, plan.nameKey);
  const category = t(plan.categoryKey, plan.categoryKey);
  const fullName = t(plan.fullNameKey, name);
  const displayPrice = isAnnual ? plan.annualMonthlyEff : plan.monthlyPrice;
  const billedText = isAnnual
    ? t('pricing_billed_annually', 'billed annually at') + ' ' + formatINR(plan.annualTotal)
    : t('pricing_billed_monthly', 'billed monthly');
  const yearlySavings = (plan.monthlyPrice * 12) - plan.annualTotal;
  const cycle = isAnnual ? 'yearly' : 'monthly';
  const chargeAmount = isAnnual ? plan.annualTotal : plan.monthlyPrice;
  const accent = plan.accent || '#00ffcc';
  const icon = plan.icon || 'fa-chart-bar';
  const learnMoreLabel = t('pricing_learn_more', 'Learn more');
  const learnMore = plan.page
    ? '<a href="' + plan.page + '" class="pricing-card-learn">' + learnMoreLabel + ' <i class="fas fa-arrow-right"></i></a>'
    : '';
  const badgeLabel = plan.badgeKey ? t(plan.badgeKey, '') : '';
  const badgeIcon = plan.badgeKey === 'pricing_badge_premium_choice' ? '👑' : '⭐';
  const badgeHtml = plan.badgeKey
    ? '<div class="popular-badge">' + badgeIcon + ' ' + badgeLabel + '</div>'
    : '';
  const cardClasses = 'pricing-card' +
    (plan.popular ? ' popular' : '') +
    (plan.badgeKey ? ' has-badge' : '');
  const perMonth = t('pricing_per_month', '/mo');
//   const savingsHtml = isAnnual
//     ? '<p class="savings-text">' + t('pricing_save_year', 'Save {amount}/year').replace('{amount}', formatINR(yearlySavings)) + '</p>'
//     : '<p class="savings-text savings-placeholder">&nbsp;</p>';
  const savingsHtml = isAnnual
  ? '<p class="savings-text">' +
      t('pricing_save_year', 'Save {amount}/year').replace('{amount}', formatINR(yearlySavings)) +
      ' <span class="savings-tooltip-wrap">' +
        '<i class="fas fa-info-circle savings-info-icon"></i>' +
        '<span class="savings-tooltip-box">' +
          t('pricing_save_tooltip', 'Compared to paying monthly. Your full annual price is ₹{annual} against ₹{monthlyTotal} with regular monthly payments.')
            .replace('{annual}', Math.round(plan.annualTotal).toLocaleString('en-IN'))
            .replace('{monthlyTotal}', Math.round(plan.monthlyPrice * 12).toLocaleString('en-IN')) +
        '</span>' +
      '</span>' +
    '</p>'
  : '<p class="savings-text savings-placeholder">&nbsp;</p>';
  const buyNow = t('buy_now', 'Buy Now');

  return (
    '<div class="' + cardClasses + '" style="--card-accent:' + accent + '">' +
      badgeHtml +
      '<div class="pricing-card-icon"><i class="fas ' + icon + '"></i></div>' +
      '<div class="pricing-card-head">' +
        '<h3>' + name + ' [CRM]</h3>' +
        '<p class="pricing-card-desc">' + category + '</p>' +
      '</div>' +
      learnMore +
      '<div class="pricing-price-row">' +
        '<span class="price-currency">₹</span>' +
        '<span class="price-value">' + displayPrice.toLocaleString('en-IN') + '</span>' +
        '<span class="price-period">' + perMonth + '</span>' +
      '</div>' +
      '<p class="billed-text">' + billedText + '</p>' +
      savingsHtml +
      '<button type="button" class="pricing-buy-btn"' +
        ' data-product-id="' + escapeAttr(plan.productId) + '"' +
        ' data-plan-type="' + cycle + '"' +
        ' data-amount="' + chargeAmount + '"' +
        ' data-product-name="' + escapeAttr(fullName) + '">' + buyNow + '</button>' +
      '<ul class="pricing-features">' +
        plan.featureKeys.map(function (key) {
          return '<li>' + t(key, key) + '</li>';
        }).join('') +
      '</ul>' +
    '</div>'
  );
}

function renderGrid(gridId, plans, isAnnual) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = plans.map(function (plan) { return buildCard(plan, isAnnual); }).join('');
}

function renderPricing() {
  const isAnnual = billingCycle === 'yearly';
  renderGrid('pricingGrid', INDIVIDUAL_PLANS, isAnnual);
  renderGrid('pricingGridCombo', COMBO_PLANS, isAnnual);
  setupViewportReveals(document.querySelectorAll('.pricing-card'));
}

let promoRevealObserver;

function setupPromoCardReveals(container) {
  if (!container || container.dataset.revealReady) return;
  const cards = Array.from(container.querySelectorAll('.pricing-promo-card'));
  if (!cards.length) return;

  cards.forEach(function (card, index) {
    const direction = index % 2 === 0 ? 'reveal-from-left' : 'reveal-from-right';
    card.classList.add('reveal-card');
    card.classList.add(direction);
    // Both cards must start sliding at the exact same instant, not staggered.
    card.style.setProperty('--reveal-delay', '0ms');
  });

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    cards.forEach(function (card) { card.classList.add('is-revealed'); });
    container.dataset.revealReady = 'true';
    return;
  }

  container.dataset.revealReady = 'true';

  function toggleCards(revealed) {
    cards.forEach(function (card) {
      if (card._revealTimer) {
        clearTimeout(card._revealTimer);
        card._revealTimer = null;
      }
      if (revealed) {
        card.classList.add('is-revealed');
        card._revealTimer = window.setTimeout(function () {
          card.classList.add('is-interactive');
        }, 3600);
      } else {
        card.classList.remove('is-revealed');
        card.classList.remove('is-interactive');
      }
    });
  }

  // Watching the (untransformed) container instead of the cards themselves —
  // the cards slide in from 70-100vw off-screen, and a browser's intersection
  // check on a heavily-transformed element is unreliable across viewport
  // sizes. The container never moves, so this always sees it correctly.
  promoRevealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      toggleCards(entry.isIntersecting);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });

  promoRevealObserver.observe(container);
}

let revealObserver;

function setupViewportReveals(elements) {
  const cards = Array.from(elements || []).filter(function (card) {
    return !card.dataset.revealReady;
  });
  if (!cards.length) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    cards.forEach(function (card) { card.classList.add('is-revealed'); });
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        const target = entry.target;

        // Cancel any pending "is-interactive" timer from a previous reveal
        // so it can't fire late after the card has been hidden again.
        if (target._revealTimer) {
          clearTimeout(target._revealTimer);
          target._revealTimer = null;
        }

        if (entry.isIntersecting) {
          target.classList.add('is-revealed');
          const delay = parseFloat(target.style.getPropertyValue('--reveal-delay')) || 0;
          target._revealTimer = window.setTimeout(function () {
            target.classList.add('is-interactive');
          }, delay + 2800);
        } else {
          // Reset so the slide-in plays again next time it scrolls into view.
          target.classList.remove('is-revealed');
          target.classList.remove('is-interactive');
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });
  }

  cards.forEach(function (card, index) {
    const premiumGrid = card.closest('.premium-indicator-grid');
    const premiumCardIndex = premiumGrid
      ? Array.from(premiumGrid.querySelectorAll('.premium-card-link')).indexOf(card)
      : -1;
    const pricingGrid = card.closest('.pricing-grid');
    const pricingCardIndex = pricingGrid
      ? Array.from(pricingGrid.querySelectorAll('.pricing-card')).indexOf(card)
      : -1;
    const cardIndexInGroup = premiumCardIndex !== -1
      ? premiumCardIndex
      : (pricingCardIndex !== -1 ? pricingCardIndex : index);
    const direction = (premiumCardIndex !== -1 || pricingCardIndex !== -1)
      ? (cardIndexInGroup < 3 ? 'reveal-from-right' : 'reveal-from-left')
      : (index % 2 === 0 ? 'reveal-from-left' : 'reveal-from-right');

    card.dataset.revealReady = 'true';
    card.classList.add('reveal-card');
    card.classList.add(direction);
    card.style.setProperty('--reveal-delay', (cardIndexInGroup % 3) * 140 + 'ms');
    revealObserver.observe(card);
  });
}

function syncBillingRadios(cycle) {
  document.querySelectorAll('.billing-radio-wrap input[type="radio"]').forEach(function (radio) {
    radio.checked = radio.value === cycle;
  });
}

function applyPricingTheme() {
  const section = document.getElementById('pricing');
  if (!section) return;
  section.style.setProperty('--pricing-individual-title-color', PRICING_THEME.individualTitleColor);
  section.style.setProperty('--pricing-combo-title-color', PRICING_THEME.comboTitleColor);
}

function initBillingRadios() {
  const wraps = document.querySelectorAll('.billing-radio-wrap');
  const grids = [document.getElementById('pricingGrid'), document.getElementById('pricingGridCombo')];
  if (!wraps.length) return;

  syncBillingRadios(billingCycle);

  wraps.forEach(function (wrap) {
    wrap.addEventListener('change', function (e) {
      const radio = e.target;
      if (radio.type !== 'radio' || !radio.checked) return;

      billingCycle = radio.value;
      syncBillingRadios(billingCycle);

      grids.forEach(function (grid) {
        if (!grid) return;
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(6px)';
        grid.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
      });
      setTimeout(function () {
        renderPricing();
        grids.forEach(function (grid) {
          if (!grid) return;
          grid.style.opacity = '1';
          grid.style.transform = 'translateY(0)';
        });
      }, 140);
    });
  });
}

function attachBuyNowHandlers() {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.pricing-buy-btn[data-product-id]');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const productId = btn.dataset.productId;
    const planType = btn.dataset.planType;
    const baseAmount = parseFloat(btn.dataset.amount, 10);
    const productName = btn.dataset.productName;

    if (typeof window.initPayment === 'function') {
      window.initPayment(productId, planType, baseAmount, productName);
    } else {
      console.error('initPayment is not loaded');
      alert('Payment system is still loading. Please try again in a moment.');
    }
  });
}

// New — separate function for the savings tooltip
function attachSavingsTooltipHandlers() {
  document.addEventListener('click', function (e) {
    const wrap = e.target.closest('.savings-tooltip-wrap');
    document.querySelectorAll('.savings-tooltip-wrap.active').forEach(function (el) {
      if (el !== wrap) el.classList.remove('active');
    });
    if (wrap) {
      e.stopPropagation();
      wrap.classList.toggle('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  applyPricingTheme();
  initBillingRadios();
  renderPricing();
  setupViewportReveals(document.querySelectorAll('#indicators .premium-card-link'));
  setupPromoCardReveals(document.querySelector('.pricing-extras'));
  attachBuyNowHandlers();
  attachSavingsTooltipHandlers();

  // Resume purchase after login — slight delay ensures auth session is readable
  setTimeout(function () {
    if (typeof resumePendingPurchase === 'function') {
      resumePendingPurchase();
    }
  }, 100);

  // Scroll to pricing when returning from auth with hash
  if (window.location.hash === '#pricing') {
    setTimeout(function () {
      const el = document.getElementById('pricing');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }
});