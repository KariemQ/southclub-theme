/**
 * Hero-Video Manager  •  v4.1
 * ───────────────────────────
 * • Sticky engages when the hero’s BOTTOM sentinel rises past
 *   (announcement-bar height + EARLY_OFFSET) from the top of the viewport.
 * • Unsticks the instant you scroll back into the hero.
 * • No header jump / flash.
 */

(function () {
  'use strict';

  /*── CONFIG ───────────────────────────────────────────────*/
  const EARLY_OFFSET = 0;          // px – lower = sooner, higher = later
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

    /* 2 ▸ IntersectionObserver decides sticky on/off */
    const barH = bar.offsetHeight;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldStick = !entry.isIntersecting;          // sentinel above root
        headerGroup.classList.toggle('header--is-sticky', shouldStick);
        headerComp?.classList.toggle('scrolled-down',       shouldStick);
      },
      {
        // Shift root top downward by (bar height + EARLY_OFFSET) so we fire sooner
        rootMargin: `-${barH + EARLY_OFFSET}px 0px 0px 0px`,
        threshold: 0
      }
    );
    observer.observe(sentinel);

    /* 3 ▸ Smooth-scroll from hero video / arrow */
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

    console.log(
      `Hero-Video Manager: init  (barH ${barH}px, offset ${EARLY_OFFSET}px)`
    );
  }
})();
