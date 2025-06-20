/**
 * Hero-Video Manager • v4.3
 * ─────────────────────────
 * • Sticky ON  ➜ when hero’s bottom rises past
 *               (announcementBarHeight + navHeight + EARLY_OFFSET)
 *               ➜ i.e. the TOP of the announcement bar hits the viewport top.
 * • Sticky OFF ➜ as soon as you scroll back up into the hero.
 */

(function () {
  'use strict';

  /*── CONFIG ───────────────────────────────────────────────*/
  const EARLY_OFFSET = 6;            // px – tweak earlier/later
  const BAR_SEL      = '.announcement-bar';
  const NAV_SEL      = 'header-component';        // nav row element

  /*── BOOTSTRAP ────────────────────────────────────────────*/
  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

  /*── MAIN ────────────────────────────────────────────────*/
  function init() {
    const hero        = document.querySelector('.hero-section');
    const headerGroup = document.querySelector('#header-group');
    const bar         = document.querySelector(BAR_SEL);
    const nav         = document.querySelector(NAV_SEL);

    if (!hero || !headerGroup || !bar || !nav) {
      console.warn('Hero-Video Manager: required elements missing.');
      return;
    }

    /* 1 ▸ Measure bar + nav height (they’re in normal flow individually) */
    const barH = bar.offsetHeight;
    const navH = nav.offsetHeight;
    const totalH = barH + navH;             // full visible header stack

    /* 2 ▸ Sentinel stuck to hero’s bottom */
    const sentinel = document.createElement('div');
    sentinel.style.cssText =
      'position:absolute; bottom:0; left:0; width:1px; height:1px; pointer-events:none;';
    hero.appendChild(sentinel);

    /* 3 ▸ IntersectionObserver flips sticky */
    const observer = new IntersectionObserver(
      ([entry]) => {
        const stuck = !entry.isIntersecting;   // sentinel above root box
        headerGroup.classList.toggle('header--is-sticky', stuck);
        nav.classList.toggle   ('scrolled-down',         stuck); // optional shadow
      },
      {
        rootMargin: `-${totalH + EARLY_OFFSET}px 0px 0px 0px`,
        threshold: 0
      }
    );
    observer.observe(sentinel);

    /* 4 ▸ Smooth-scroll from hero click / arrow */
    function scrollToContent(e) {
      e.preventDefault();
      const targetY = hero.offsetHeight - totalH - EARLY_OFFSET;
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
      `Hero-Video Manager: init  (bar ${barH}px  nav ${navH}px  offset ${EARLY_OFFSET}px)`
    );
  }
})();
