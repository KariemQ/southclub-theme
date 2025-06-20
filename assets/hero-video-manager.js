/**
 * Hero-Video Manager  —  v2.1
 * ───────────────────────────
 * • Fixes “late” sticky-header trigger by firing a few pixels
 *   before the hero fully leaves the viewport.
 * • Uses a single EARLY_OFFSET constant so you can tune the feel.
 */

(function () {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────────────── */
  const EARLY_OFFSET = 8; // pixels before the hero’s bottom hits the top

  /* ── BOOTSTRAP ───────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── MAIN ───────────────────────────────────────────────── */
  function init() {
    const heroSection   = document.querySelector('.hero-section');
    const headerGroup   = document.querySelector('#header-group');
    const headerComponent = document.querySelector('header-component');

    if (!heroSection || !headerGroup) {
      console.warn('Hero Video Manager: required elements not found.');
      return;
    }

    let isSticky = false;
    let ticking  = false;

    /* -- Helper: where should the header stick? -------------- */
    function getTriggerPoint() {
      const heroH   = heroSection.offsetHeight;
      const headH   = headerComponent?.offsetHeight || 0;
      return heroH - headH - EARLY_OFFSET;
    }

    /* -- Scroll handler -------------------------------------- */
    function handleScroll() {
      const shouldStick = window.pageYOffset >= getTriggerPoint();
      if (shouldStick === isSticky) return;      // no change

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

    /* -- Smooth-scroll arrow / video click ------------------- */
    function scrollToContent(e) {
      e.preventDefault();
      const heroH   = heroSection.offsetHeight;
      const headH   = headerComponent?.offsetHeight || 0;
      const targetY = Math.max(heroH - headH - EARLY_OFFSET, 0);

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }

    /* -- Wire up --------------------------------------------- */
    window.addEventListener('scroll', onScroll, { passive: true });

    document
      .querySelectorAll('.hero-video__wrapper, .hero-video__scroll-down')
      .forEach(el => {
        el.addEventListener('click', scrollToContent);
        el.addEventListener('keydown', ev => {
          if (ev.key === 'Enter' || ev.key === ' ') scrollToContent(ev);
        });
      });

    /* Initial state */
    handleScroll();
    console.log('Hero Video Manager: initialized with EARLY_OFFSET =', EARLY_OFFSET);
  }
})();
