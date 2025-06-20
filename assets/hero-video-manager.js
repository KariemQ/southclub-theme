/**
 * Hero-Video Manager  •  v3.5
 * ───────────────────────────
 * • Uses an invisible “sentinel” placed at the very bottom of the hero.
 * • Sticky turns on when that sentinel scrolls past the viewport top
 *   (earlier by EARLY_OFFSET px) and turns off as soon as it re-enters.
 * • No scroll-math side-effects, so no header jump or lingering stick.
 */

(function () {
  'use strict';

  /*── CONFIG ───────────────────────────────────────────────*/
  const EARLY_OFFSET = 6;                  // tweak feel here (px)

  /*── BOOTSTRAP ────────────────────────────────────────────*/
  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

  /*── MAIN ────────────────────────────────────────────────*/
  function init() {
    const hero        = document.querySelector('.hero-section');
    const headerGroup = document.querySelector('#header-group');
    const headerComp  = document.querySelector('header-component');

    if (!hero || !headerGroup) {
      console.warn('Hero-Video Manager: required elements missing.');
      return;
    }

    /* 1 ▸ Create a 1×1-px sentinel pinned to the hero’s bottom edge */
    const sentinel = document.createElement('div');
    sentinel.style.cssText = `
      position:absolute; bottom:0; left:0; width:1px; height:1px; pointer-events:none;
    `;
    hero.appendChild(sentinel);

    /* 2 ▸ IntersectionObserver decides sticky state */
    const observer = new IntersectionObserver(
      ([entry]) => {
        const stuck = !entry.isIntersecting;          // sentinel above viewport
        headerGroup.classList.toggle('header--is-sticky', stuck);
        headerComp?.classList.toggle('scrolled-down',   stuck);
      },
      {
        rootMargin: `-${EARLY_OFFSET}px 0px 0px 0px`,  // fire EARLY_OFFSET sooner
        threshold: 0
      }
    );
    observer.observe(sentinel);

    /* 3 ▸ Smooth-scroll when user clicks video/arrow */
    function scrollToContent(e) {
      e.preventDefault();
      const target = hero.offsetHeight - EARLY_OFFSET;
      window.scrollTo({ top: target, behavior: 'smooth' });
    }

    document
      .querySelectorAll('.hero-video__wrapper, .hero-video__scroll-down')
      .forEach(el => {
        el.addEventListener('click', scrollToContent);
        el.addEventListener('keydown', ev => {
          if (ev.key === 'Enter' || ev.key === ' ') scrollToContent(ev);
        });
      });

    console.log(`Hero-Video Manager: init (EARLY_OFFSET = ${EARLY_OFFSET}px)`);
  }
})();
