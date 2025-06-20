/**
 * Hero-Video Manager  •  v3.0
 * ──────────────────────────
 * • Sticky engages when the announcement-bar’s top hits the
 *   viewport top (early by EARLY_OFFSET px).
 * • Uses getBoundingClientRect() instead of scroll-Y maths,
 *   so it adapts to dynamic heights, zoom, etc.
 */

(function () {
  'use strict';

  /*── CONFIG ────────────────────────────────────────────────*/
  const EARLY_OFFSET = 6;                  // ← tweak to taste (px)
  const BAR_SEL      = '.announcement-bar';

  /*── BOOTSTRAP ─────────────────────────────────────────────*/
  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

  /*── MAIN ─────────────────────────────────────────────────*/
  function init() {
    const hero          = document.querySelector('.hero-section');
    const headerGroup   = document.querySelector('#header-group');
    const headerComp    = document.querySelector('header-component');
    const bar           = document.querySelector(BAR_SEL);

    if (!hero || !headerGroup || !bar) {
      console.warn('Hero-Video Manager: required elements missing.');
      return;
    }

    const barH = bar.offsetHeight; // may be needed elsewhere

    let sticky = false;
    let ticking = false;

    /*-- Decide if we should stick --------------------------------------*/
    function evaluate() {
      // Distance between bar’s top and viewport top
      const barTop = bar.getBoundingClientRect().top;
      const shouldStick = barTop <= EARLY_OFFSET;

      if (shouldStick === sticky) return;          // no change

      sticky = shouldStick;
      headerGroup.classList.toggle('header--is-sticky', sticky);
      headerComp?.classList.toggle('scrolled-down', sticky);
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          evaluate();
          ticking = false;
        });
        ticking = true;
      }
    }

    /*-- Smooth-scroll on click / keydown -------------------------------*/
    function scrollToContent(e) {
      e.preventDefault();

      // Scroll to just past the bar so header is already fixed
      const target = hero.offsetHeight - barH - EARLY_OFFSET;
      window.scrollTo({ top: Math.max(target, 0), behavior: 'smooth' });
    }

    /*-- Wiring ---------------------------------------------------------*/
    window.addEventListener('scroll', onScroll, { passive: true });
    document
      .querySelectorAll('.hero-video__wrapper, .hero-video__scroll-down')
      .forEach(el => {
        el.addEventListener('click',      scrollToContent);
        el.addEventListener('keydown', ev => {
          if (ev.key === 'Enter' || ev.key === ' ') scrollToContent(ev);
        });
      });

    /* initial state */
    evaluate();
    console.log(`Hero-Video Manager: init (EARLY_OFFSET = ${EARLY_OFFSET}px)`);
  }
})();
