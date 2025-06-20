/**
 * Hero-Video Manager  v2.2
 * ────────────────────────
 * • Sticky fires when the ANNOUNCEMENT BAR touches the viewport top.
 * • Single EARLY_OFFSET constant for micro-tuning.
 * • Exposes bar height as CSS var  --announcement-bar-h   (for CSS nudge).
 */

(function () {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────────────── */
  const EARLY_OFFSET = 16;                    // px before bar reaches top
  const ANNOUNCEMENT_BAR_SELECTOR = '.announcement-bar';

  /* ── BOOTSTRAP ───────────────────────────────────────────── */
  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

  /* ── MAIN ───────────────────────────────────────────────── */
  function init() {
    const heroSection     = document.querySelector('.hero-section');
    const headerGroup     = document.querySelector('#header-group');
    const headerComponent = document.querySelector('header-component');
    const annBar          = document.querySelector(ANNOUNCEMENT_BAR_SELECTOR);

    if (!heroSection || !headerGroup || !annBar) {
      console.warn('Hero-Video Manager: required elements missing.');
      return;
    }

    /* expose bar height to CSS for the small upward nudge */
    const barH = annBar.offsetHeight;
    document.documentElement.style.setProperty('--announcement-bar-h', `${barH}px`);

    let isSticky = false;
    let ticking  = false;

    /* ── Trigger point where bar hits viewport top ─────────── */
    function getTriggerPoint() {
      const heroH  = heroSection.offsetHeight;
      return heroH - barH - EARLY_OFFSET;
    }

    /* ── Scroll logic ─────────────────────────────────────── */
    function handleScroll() {
      const shouldStick = window.pageYOffset >= getTriggerPoint();
      if (shouldStick === isSticky) return;

      isSticky = shouldStick;
      headerGroup.classList.toggle('header--is-sticky', isSticky);
      headerComponent?.classList.toggle('scrolled-down', isSticky);
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    /* ── Smooth scroll via arrow / video click ─────────────── */
    function scrollToContent(e) {
      e.preventDefault();
      const heroH  = heroSection.offsetHeight;
      const target = Math.max(heroH - barH - EARLY_OFFSET, 0);

      window.scrollTo({ top: target, behavior: 'smooth' });
    }

    /* ── Wiring ────────────────────────────────────────────── */
    window.addEventListener('scroll', onScroll, { passive: true });

    document
      .querySelectorAll('.hero-video__wrapper, .hero-video__scroll-down')
      .forEach(el => {
        el.addEventListener('click', scrollToContent);
        el.addEventListener('keydown', ev => {
          if (ev.key === 'Enter' || ev.key === ' ') scrollToContent(ev);
        });
      });

    /* initial state */
    handleScroll();
    console.log('Hero-Video Manager: init (barH=', barH, 'px, EARLY_OFFSET=', EARLY_OFFSET, 'px)');
  }
})();
