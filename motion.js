/* Lightweight page motion: content reveals only once as it enters the viewport. */
(function () {
  function initialiseMotion() {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var selectors = [
      '.hero-content',
      '#indicators > h2',
      '.indicator-clarity-callout',
      '#yt-carousel-section > h2',
      '.yt-carousel-container',
      '.pricing-header',
      '.pricing-group-header',
      '.billing-radio-wrap',
      '.pricing-extras > .pricing-promo-card',
      '.faq-title',
      '#contact > h2',
      '#contact > p',
      '#contact .upi-section',
      '.custom-footer .footer-section'
    ];
    var elements = Array.from(document.querySelectorAll(selectors.join(',')));
    if (!elements.length) return;

    elements.forEach(function (element, index) {
      element.classList.add('motion-reveal');
      element.style.setProperty('--motion-delay', (index % 4) * 170 + 'ms');
    });

    document.body.classList.add('motion-enabled');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach(function (element) { element.classList.add('is-inview'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-inview');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });

    elements.forEach(function (element) { observer.observe(element); });
  }

  document.addEventListener('DOMContentLoaded', initialiseMotion);
}());
