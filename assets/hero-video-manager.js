/**
 * Hero-Video Manager  • v7.4
 * ──────────────────────────
 * Home page (contains .hero-section):
 *   Sticky ON  ➜ heroBottom ≤ totalHeaderH + EARLY_OFFSET
 *   Sticky OFF ➜ heroBottom > totalHeaderH + EARLY_OFFSET
 *
 * Other pages (no .hero-section):
 *   Sticky ON  ➜ pageYOffset  > EARLY_OFFSET
 *   Sticky OFF ➜ pageYOffset ≤ EARLY_OFFSET
 *
 * The actual sticking on non-home pages is now handled by CSS
 * (position: sticky; top: 0) so we no longer juggle margin-top.
 * JS simply toggles header--is-sticky / scrolled-down to drive
 * the logo animation.
 */

(function () {
  'use strict';

  /*── CONFIG ───────────────────────────────────────────────*/
  const EARLY_OFFSET = 0;            // px – raise if you want a small gap before stick

  /*── BOOTSTRAP ────────────────────────────────────────────*/
  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

  /*── MAIN ────────────────────────────────────────────────*/
  function init() {
    const hero        = document.querySelector('.hero-section');      // null on non-home pages
    const bar         = document.querySelector('.announcement-bar');
    const nav         = document.querySelector('header-component');
    const headerGroup = document.querySelector('#header-group');

    if (!bar || !nav || !headerGroup) {
      console.warn('Hero-Video Manager: required elements missing.');
      return;
    }

    /* heights (static, used for home-page logic only) */
    const barH   = bar.offsetHeight;     // ≈ 31 px
    const navH   = nav.offsetHeight;     // ≈ 60 px
    const totalH = barH + navH;          // ≈ 91 px

    /* rAF-throttled evaluator */
    let ticking = false;
    function evaluate() {
      let shouldStick;

      if (hero) {
        /* Home page: compare hero bottom with header height */
        const heroBottom = hero.getBoundingClientRect().bottom;
        shouldStick = heroBottom <= (totalH + EARLY_OFFSET);
      } else {
        /* Other pages: stick after the first scroll pixel */
        shouldStick = window.pageYOffset > EARLY_OFFSET;
      }

      if (headerGroup.classList.contains('header--is-sticky') !== shouldStick) {
        headerGroup.classList.toggle('header--is-sticky', shouldStick);
        nav.classList.toggle('scrolled-down',             shouldStick);  // logo flip
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
    evaluate();                                    // initial state

    /* -------- Smooth scroll (home page only) -------- */
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
      `Hero-Video Manager: init (home=${!!hero}, bar=${barH}px, nav=${navH}px, offset=${EARLY_OFFSET}px)`
    );
  }
})();
