/**
 * Hero-Video Manager  •  v4.2
 * ───────────────────────────
 * • Sticky turns on when the hero’s BOTTOM sentinel rises past
 *   (full header height + EARLY_OFFSET) from the top of the viewport.
 *   ↳ This means the TOP of the announcement bar has just hit the viewport top.
 * • Sticky turns off as soon as you scroll back up into the hero.
 * • Zero header jump or lingering stick.
 */

(function () {
  'use strict';

  /*── CONFIG ───────────────────────────────────────────────*/
  const EARLY_OFFSET = 6;            // px – lower = sooner, higher = later
  const BAR_SEL      = '.announcement-bar';

  /*── BOOTSTRAP ────────────────────────────────────────────*/
  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

  /*── MAIN ────────────────────────────────────────────────*/
  function init() {
    const hero        = document.querySelector('.hero-section');
    const headerGroup = document.querySelector('#header-group');
    const headerComp  = document.querySelector('header-component');
    const bar         = document.querySelector(BAR_SEL);

    if (!hero || !headerGroup || !bar) {
      console.warn('Hero-Video Manager: required elements missing.');
      return;
    }

    /* 1 ▸ Sentinel anchored to the BOTTOM of the hero */
    const sentinel = document.createElement('div');
    sentinel.style.cssText =
      'position:absolute; bottom:0; left:0; width:1px; height:1px; pointer-events:none;';
    hero.appendChild(sentinel);

    /* 2 ▸ IntersectionObserver flips sticky state */
    const headerH = headerGroup.offsetHeight;          // full height (bar + nav)
    const observer = new IntersectionObserver(
      ([entry]) => {
        const stuck = !entry.isIntersecting;           // sentinel above root
        headerGroup.classList.toggle('header--is-sticky', stuck);
        headerComp?.classList.toggle('scrolled-down',   stuck);
      },
      {
        // Shift root top downward by (header height + EARLY_OFFSET)
        // so we fire EARLY_OFFSET pixels *before* bar hits viewport top
        rootMargin: `-${headerH + EARLY_OFFSET}px 0px 0px 0px`,
        threshold: 0
      }
    );
    observer.observe(sentinel);

    /* 3 ▸ Smooth-scroll to content on hero click / arrow */
    function scrollToContent(e) {
      e.preventDefault();
      const target = hero.offsetHeight - headerH - EARLY_OFFSET;
      window.scrollTo({ top: Math.max(target, 0), behavior: 'smooth' });
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
      `Hero-Video Manager: init  (headerH ${headerH}px, offset ${EARLY_OFFSET}px)`
    );
  }
})();
