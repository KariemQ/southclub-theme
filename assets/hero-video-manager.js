/**
 * Hero-Video Manager  •  v4.0
 * ───────────────────────────
 * • Sticky turns on when the hero’s TOP sentinel scrolls past
 *   (announcement-bar height + EARLY_OFFSET) above the viewport.
 * • Turns off the moment the sentinel re-enters on scroll-up.
 * • Zero visual glitches; no translateY hacks needed.
 */

(function () {
  'use strict';

  /*── CONFIG ───────────────────────────────────────────────*/
  const EARLY_OFFSET = 6;           // px before bar reaches viewport top
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

    /* 1 ▸ Build a 1×1-px sentinel fixed to the TOP of the hero */
    const sentinel = document.createElement('div');
    sentinel.style.cssText = `
      position:absolute; top:0; left:0; width:1px; height:1px; pointer-events:none;
    `;
    hero.appendChild(sentinel);

    /* 2 ▸ IntersectionObserver drives sticky on/off */
    const barH = bar.offsetHeight;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const stuck = !entry.isIntersecting;          // sentinel above root
        headerGroup.classList.toggle('header--is-sticky', stuck);
        headerComp?.classList.toggle('scrolled-down',   stuck);
      },
      {
        // Shrink the root by (bar height + offset) so we fire sooner
        rootMargin: `-${barH + EARLY_OFFSET}px 0px 0px 0px`,
        threshold: 0
      }
    );
    observer.observe(sentinel);

    /* 3 ▸ Smooth-scroll to content on video/arrow click */
    function scrollToContent(e) {
      e.preventDefault();
      const target = hero.offsetHeight - barH - EARLY_OFFSET;
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

    console.log(`Hero-Video Manager: init  (barH ${barH}px, offset ${EARLY_OFFSET}px)`);
  }
})();
