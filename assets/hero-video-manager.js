/**
 * Hero-Video Manager  • v7.0
 * ──────────────────────────
 * Sticky ON  ➜ heroBottom ≤ (totalHeaderH + EARLY_OFFSET)
 * Sticky OFF ➜ heroBottom > (totalHeaderH + EARLY_OFFSET)
 *
 *   heroBottom     = .hero-section.getBoundingClientRect().bottom
 *   totalHeaderH   = announcementBarH + navRowH
 *
 * Result: flips precisely when the TOP of the announcement bar
 *         hits the viewport top (± EARLY_OFFSET px).
 */

(function () {
  'use strict';

  /*── CONFIG ───────────────────────────────────────────────*/
  const EARLY_OFFSET = 0;        // 0 = exact; 2-5 = a hair early

  /*── BOOTSTRAP ────────────────────────────────────────────*/
  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

  /*── MAIN ────────────────────────────────────────────────*/
  function init() {
    const hero         = document.querySelector('.hero-section');
    const bar          = document.querySelector('.announcement-bar');
    const nav          = document.querySelector('header-component');
    const headerGroup  = document.querySelector('#header-group');

    if (!hero || !bar || !nav || !headerGroup) {
      console.warn('Hero-Video Manager: required elements missing.');
      return;
    }

    if (!hero) {
      headerGroup?.classList.add('header--is-sticky');
      return;
    }

    /* heights (static) */
    const barH = bar.offsetHeight;          // ≈ 31 px
    const navH = nav.offsetHeight;          // ≈ 60 px
    const totalH = barH + navH;             // ≈ 91 px

    /* rAF-throttled scroll evaluator */
    let ticking = false;
    function evaluate() {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const shouldStick = heroBottom <= (totalH + EARLY_OFFSET);

      if (headerGroup.classList.contains('header--is-sticky') !== shouldStick) {
        headerGroup.classList.toggle('header--is-sticky', shouldStick);
        nav.classList.toggle('scrolled-down',             shouldStick); // keeps your logo animation
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
    evaluate();                               // set initial state

    /* smooth-scroll when user clicks hero video / arrow */
    const clickTargets = document.querySelectorAll('.hero-video__wrapper, .hero-video__scroll-down');
    clickTargets.forEach(el => {
      el.addEventListener('click', scrollToContent);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') scrollToContent(e);
      });
    });

    function scrollToContent(e) {
      e.preventDefault();
      const target = hero.offsetHeight - totalH - EARLY_OFFSET;
      window.scrollTo({ top: Math.max(target, 0), behavior: 'smooth' });
    }

    console.log(
      `Hero-Video Manager: init  (bar=${barH}px, nav=${navH}px, offset=${EARLY_OFFSET}px)`
    );
  }
})();
