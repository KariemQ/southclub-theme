/* ================================================================
   South-Club custom header – hero-video variant
   ================================================================= */
import { Component } from '@theme/component';
import { onDocumentReady, changeMetaThemeColor } from '@theme/utilities';

/**
 * @typedef {Object} HeaderComponentRefs
 * @property {HTMLDivElement} headerDrawerContainer
 * @property {HTMLElement}   headerMenu
 * @property {HTMLElement}   headerRowTop
 */

class HeaderComponent extends Component {
  /* ---------- required theme refs ---------- */
  requiredRefs = ['headerDrawerContainer', 'headerMenu', 'headerRowTop'];

  /* ---------- private state ---------- */
  #menuDrawerHiddenWidth = null;
  #intersectionObserver  = null;
  #resizeObserver        = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const { height } = entry.target.getBoundingClientRect();
    document.body.style.setProperty('--header-height', `${height}px`);
    if (this.#menuDrawerHiddenWidth && window.innerWidth > this.#menuDrawerHiddenWidth) {
      this.#updateMenuVisibility(false);
    }
  });

  #offscreen     = false;        // used by the theme scroll-up mode
  #lastScrollTop = 0;
  #timeout       = null;
  #animationDelay = 150;

  #isHeroHeader = false;         // set once in connectedCallback()

  /* ==============================================================
     HERO-VIDEO  SCROLL HANDLER
     ============================================================== */
  #handleWindowScroll = () => {
    if (this.#isHeroHeader) {
      /* ─── our custom logic ─── */
      const headerGroup  = document.querySelector('#header-group');
      if (!headerGroup) return;

      const headerHeight = headerGroup.offsetHeight;
      const trigger      = window.innerHeight - headerHeight;   // 100 vh – bar

      if (window.scrollY >= trigger) {
        headerGroup.classList.add('header--is-sticky');
        this.classList.add('scrolled-down');      // flip logo
      } else {
        headerGroup.classList.remove('header--is-sticky');
        this.classList.remove('scrolled-down');
      }
      return;   // prevent the original “scroll-up” logic from running
    }

    /* ─────────────────────────────────────────────
       ORIGINAL THEME  “scroll-up”  BEHAVIOUR
       (unchanged)
       ──────────────────────────────────────────── */
    const stickyMode   = this.getAttribute('sticky');
    if (!this.#offscreen && stickyMode !== 'always') return;

    const scrollTop    = document.scrollingElement?.scrollTop ?? 0;
    const isScrollingUp = scrollTop < this.#lastScrollTop;

    if (this.#timeout) {
      clearTimeout(this.#timeout);
      this.#timeout = null;
    }

    if (stickyMode === 'always') {
      if (isScrollingUp) {
        this.dataset.scrollDirection = (this.getBoundingClientRect().top >= 0) ? 'none' : 'up';
      } else {
        this.dataset.scrollDirection = 'down';
      }
      this.#lastScrollTop = scrollTop;
      return;
    }

    if (isScrollingUp) {
      this.removeAttribute('data-animating');
      if (this.getBoundingClientRect().top >= 0) {
        /* reset */
        this.#offscreen             = false;
        this.dataset.stickyState    = 'inactive';
        this.dataset.scrollDirection = 'none';
      } else {
        /* show sticky header */
        this.dataset.stickyState    = 'active';
        this.dataset.scrollDirection = 'up';
      }
    } else if (this.dataset.stickyState === 'active') {
      this.dataset.scrollDirection = 'none';
      this.setAttribute('data-animating', '');
      this.#timeout = setTimeout(() => {
        this.dataset.stickyState = 'idle';
        this.removeAttribute('data-animating');
      }, this.#animationDelay);
    } else {
      this.dataset.scrollDirection = 'none';
      this.dataset.stickyState     = 'idle';
    }

    this.#lastScrollTop = scrollTop;
  };

  /* ==============================================================
     life-cycle
     ============================================================== */
  connectedCallback() {
    /* detect if this page contains the hero-video section */
    if (document.querySelector('#shopify-section-hero-video')) {
      this.#isHeroHeader = true;
    }

    super.connectedCallback();

    /* update global --header-height variable */
    this.#resizeObserver.observe(this);

    /* theme events */
    this.addEventListener('overflowMinimum', this.#handleOverflowMinimum);

    /* register scroll listener */
    document.addEventListener('scroll', this.#handleWindowScroll);

    /* still run the theme’s sticky-state observer if configured */
    const stickyMode = this.getAttribute('sticky');
    if (stickyMode) this.#observeStickyPosition(stickyMode === 'always');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#resizeObserver.disconnect();
    this.#intersectionObserver?.disconnect();
    document.removeEventListener('scroll', this.#handleWindowScroll);
    document.body.style.setProperty('--header-height', '0px');
    this.removeEventListener('overflowMinimum', this.#handleOverflowMinimum);
  }

  /* ==============================================================
     ↓↓↓  THEME-SUPPLIED  HELPERS  (unchanged)
     ============================================================== */
  #observeStickyPosition = (alwaysSticky = true) => { /* … same as theme … */ };
  #handleOverflowMinimum = (e) => { this.#updateMenuVisibility(e.detail.minimumReached); };
  #updateMenuVisibility(hide) { /* … same as theme … */ }
}

/* register element exactly once */
if (!customElements.get('header-component')) {
  customElements.define('header-component', HeaderComponent);
}

/* keep the snippet that syncs --header-height on load */
onDocumentReady(() => {
  const header      = document.querySelector('#header-component');
  const headerGroup = document.querySelector('#header-group');
  if (!header || !headerGroup) return;

  /* keep --header-height in sync even if the group resizes */
  const ro = new ResizeObserver(() => {
    document.body.style.setProperty('--header-height', `${headerGroup.offsetHeight}px`);
  });
  ro.observe(headerGroup);
});
