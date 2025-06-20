/**
 * Hero-Video Manager  •  v6.0
 * ───────────────────────────
 * Sticky ON  ➜ when announcement bar’s top ≤ EARLY_OFFSET px
 * Sticky OFF ➜ when bar’s top  > EARLY_OFFSET px (scrolling back up)
 */

(function () {
  'use strict';

  /*── CONFIG ───────────────────────────────────────────────*/
  const EARLY_OFFSET = 1;          // px – 0 = exact; raise to fire earlier

  /*── BOOTSTRAP ────────────────────────────────────────────*/
  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

  /*── MAIN ────────────────────────────────────────────────*/
  function init() {
    const bar         = document.querySelector('.announcement-bar');
    const headerGroup = document.querySelector('#header-group');

    if (!bar || !headerGroup) {
      console.warn('Hero-Video Manager: .announcement-bar or #header-group missing.');
      return;
    }

    /*— Scroll evaluator —*/
    let ticking = false;
    function evaluate() {
      const barTop = bar.getBoundingClientRect().top;
      const shouldStick = barTop <= EARLY_OFFSET;

      headerGroup.classList.toggle('header--is-sticky', shouldStick);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(evaluate);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    evaluate();                          // set initial state

    /*— Smooth-scroll when hero video / arrow is clicked —*/
    const hero = document.querySelector('.hero-section');
    if (hero) {
      function scrollToContent(e) {
        e.preventDefault();
        const targetY = hero.offsetHeight - bar.offsetHeight - EARLY_OFFSET;
        window.scrollTo({ top: Math.max(targetY, 0), behavior: 'smooth' });
      }

      document
        .querySelectorAll('.hero-video__wrapper, .hero-video__scroll-down')
        .forEach(el => {
          el.addEventListener('click', scrollToContent);
          el.addEventListener('keydown', ev => {
            if (ev.key === 'Enter' || ev.key === ' ') scrollToContent(ev);
          });
        });
    }

    console.log('Hero-Video Manager: init  (EARLY_OFFSET =', EARLY_OFFSET, 'px)');
  }
})();
