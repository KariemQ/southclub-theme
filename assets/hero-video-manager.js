/**
 * Hero-Video Manager  •  v5.0
 * ───────────────────────────
 * • Sticky ON  when heroBottom ≤ (barHeight + EARLY_OFFSET).
 * • Sticky OFF when heroBottom  > (barHeight + EARLY_OFFSET).
 * • Timing is exact because we read hero.getBoundingClientRect().bottom
 *   on every rAF-throttled scroll event.
 */

(function () {
  'use strict';

  /*── CONFIG ───────────────────────────────────────────────*/
  const EARLY_OFFSET = 6;          // px – shrink for earlier, grow for later
  const BAR_SEL      = '.announcement-bar';

  /*── BOOTSTRAP ────────────────────────────────────────────*/
  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

  /*── MAIN ────────────────────────────────────────────────*/
  function init() {
    const hero        = document.querySelector('.hero-section');
    const headerGroup = document.querySelector('#header-group');
    const bar         = document.querySelector(BAR_SEL);

    if (!hero || !headerGroup || !bar) {
      console.warn('Hero-Video Manager: required elements missing.');
      return;
    }

    const barH = bar.offsetHeight;               // 31 px in your case

    /*— Scroll evaluator —*/
    let ticking = false;
    function evaluate() {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const shouldStick = heroBottom <= (barH + EARLY_OFFSET);

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
    evaluate();                                  // set initial state

    /*— Smooth-scroll on hero click / arrow —*/
    function scrollToContent(e) {
      e.preventDefault();
      const targetY = hero.offsetHeight - barH - EARLY_OFFSET;
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

    console.log(
      `Hero-Video Manager: init  (barH ${barH}px, offset ${EARLY_OFFSET}px)`
    );
  }
})();
