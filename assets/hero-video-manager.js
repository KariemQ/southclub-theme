/**
 * Hero-Video Manager  • v7.2
 * ──────────────────────────
 * Home page  (has .hero-section):
 *   Sticky ON  ➜ heroBottom ≤ (totalHeaderH + EARLY_OFFSET)
 *   Sticky OFF ➜ heroBottom > (totalHeaderH + EARLY_OFFSET)
 *
 * Other pages (no .hero-section):
 *   Sticky ON  ➜ pageYOffset > EARLY_OFFSET  (i.e. after first scroll)
 *   Sticky OFF ➜ pageYOffset ≤ EARLY_OFFSET
 */

(function () {
  'use strict';

  /*── CONFIG ───────────────────────────────────────────────*/
  const EARLY_OFFSET = 0;            // px – tweak if you want a gap before stick

  /*── BOOTSTRAP ────────────────────────────────────────────*/
  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

  /*── MAIN ────────────────────────────────────────────────*/
  function init() {
    const hero        = document.querySelector('.hero-section');   // null on non-home pages
    const bar         = document.querySelector('.announcement-bar');
    const nav         = document.querySelector('header-component');
    const headerGroup = document.querySelector('#header-group');

    if (!bar || !nav || !headerGroup) {
      console.warn('Hero-Video Manager: required elements missing.');
      return;
    }

    /* ----------- Pre-compute heights (home page only) ----------- */
    let totalH = 0;
    if (hero) {
      const barH = bar.offsetHeight;     // ≈ 31 px
      const navH = nav.offsetHeight;     // ≈ 60 px
      totalH = barH + navH;              // ≈ 91 px
    }

    /* ----------- rAF-throttled sticky evaluator ---------------- */
    let ticking = false;

    function evaluate() {
      let shouldStick;

      if (hero) {
        /* Home page logic */
        const heroBottom = hero.getBoundingClientRect().bottom;
        shouldStick = heroBottom <= (totalH + EARLY_OFFSET);
      } else {
        /* Other pages – stick after first scroll */
        shouldStick = window.pageYOffset > EARLY_OFFSET;
      }

      if (headerGroup.classList.contains('header--is-sticky') !== shouldStick) {
        headerGroup.classList.toggle('header--is-sticky', shouldStick);
        nav.classList.toggle('scrolled-down',             shouldStick); // keeps logo animation
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(evaluate);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    evaluate();                                    // set initial state

    /* ----------- Smooth scroll trigger (home page only) -------- */
    if (hero) {
      const clickTargets = document.querySelectorAll(
        '.hero-video__wrapper, .hero-video__scroll-down'
      );
      clickTargets.forEach(el => {
        el.addEventListener('click',      scrollToContent);
        el.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') scrollToContent(e);
        });
      });

      function scrollToContent(e) {
        e.preventDefault();
        const target = hero.offsetHeight - totalH - EARLY_OFFSET;
        window.scrollTo({ top: Math.max(target, 0), behavior: 'smooth' });
      }
    }

    console.log(
      `Hero-Video Manager: init (home=${!!hero}, offset=${EARLY_OFFSET}px)`
    );
  }
})();
