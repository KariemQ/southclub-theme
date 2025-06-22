/**
 * Hero-Video Manager  • v7.3
 * ──────────────────────────
 * Home page (has .hero-section)
 *   Sticky ON  ➜ heroBottom ≤ totalHeaderH + EARLY_OFFSET
 *   Sticky OFF ➜ heroBottom > totalHeaderH + EARLY_OFFSET
 *
 * Other pages (no .hero-section)
 *   Sticky ON  ➜ pageYOffset > EARLY_OFFSET
 *   Sticky OFF ➜ pageYOffset ≤ EARLY_OFFSET
 *   + Adds/removes an equal margin-top to MainContent so no layout jump.
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
    const hero        = document.querySelector('.hero-section');      // null off home page
    const bar         = document.querySelector('.announcement-bar');
    const nav         = document.querySelector('header-component');
    const headerGroup = document.querySelector('#header-group');
    const mainContent = document.querySelector('#MainContent') || document.body;

    if (!bar || !nav || !headerGroup) {
      console.warn('Hero-Video Manager: required elements missing.');
      return;
    }

    /* heights (static) */
    const barH   = bar.offsetHeight;     // ≈ 31 px
    const navH   = nav.offsetHeight;     // ≈ 60 px
    const totalH = barH + navH;          // ≈ 91 px

    /* helper: set / clear margin-top to prevent snap */
    function setContentOffset(enable) {
      mainContent.style.marginTop = enable ? `${totalH}px` : '0px';
    }

    /* rAF-throttled evaluator */
    let ticking = false;
    function evaluate() {
      let shouldStick;

      if (hero) {
        /* Home page logic */
        const heroBottom = hero.getBoundingClientRect().bottom;
        shouldStick = heroBottom <= (totalH + EARLY_OFFSET);
      } else {
        /* Non-home pages – stick after first scroll */
        shouldStick = window.pageYOffset > EARLY_OFFSET;
        setContentOffset(shouldStick);      // ⬅ prevent snap
      }

      if (headerGroup.classList.contains('header--is-sticky') !== shouldStick) {
        headerGroup.classList.toggle('header--is-sticky', shouldStick);
        nav.classList.toggle('scrolled-down',             shouldStick); // logo flip
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
    evaluate();                                              // initial state

    /* smooth scroll (home page only) */
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
      `Hero-Video Manager: init (home=${!!hero}, bar=${barH}px, nav=${navH}px)`
    );
  }
})();
