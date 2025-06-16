/*  assets/header.js  */
/* -------------------------------------------------------------------------- */
import { Component } from '@theme/component';
import { onDocumentReady, changeMetaThemeColor } from '@theme/utilities';

/**
 * @typedef {Object} HeaderComponentRefs
 * @property {HTMLDivElement} headerDrawerContainer
 * @property {HTMLElement}     headerMenu
 * @property {HTMLElement}     headerRowTop
 */

/**
 * @typedef {CustomEvent<{ minimumReached: boolean }>} OverflowMinimumEvent
 */

class HeaderComponent extends Component {
  /* ---------- required DOM refs ---------- */
  requiredRefs = ['headerDrawerContainer', 'headerMenu', 'headerRowTop'];

  /* ---------- private fields ---------- */
  #menuDrawerHiddenWidth = null;
  #intersectionObserver  = null;
  #offscreen             = false;
  #lastScrollTop         = 0;
  #timeout               = null;
  #animationDelay        = 150;
  #isHeroHeader          = false;

  /* ---------- keep --header-height up-to-date ---------- */
  #resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const { height } = entry.target.getBoundingClientRect();
    document.body.style.setProperty('--header-height', `${height}px`);

    /* if we hid the drawer because of a small window,
       show it again when the window is wide enough */
    if (this.#menuDrawerHiddenWidth && window.innerWidth > this.#menuDrawerHiddenWidth) {
      this.#updateMenuVisibility(false);
    }
  });

  /* ---------- sticky position observer ---------- */
  #observeStickyPosition = (alwaysSticky = true) => {
    if (this.#intersectionObserver) return;

    const config = { threshold: alwaysSticky ? 1 : 0 };
    this.#intersectionObserver = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      const { isIntersecting } = entry;

      if (alwaysSticky) {
        this.dataset.stickyState = isIntersecting ? 'inactive' : 'active';
        changeMetaThemeColor(this.refs.headerRowTop);
      } else {
        this.#offscreen = !isIntersecting || this.dataset.stickyState === 'active';
      }
    }, config);

    this.#intersectionObserver.observe(this);
  };

  /* ---------- menu overflow from header-menu ---------- */
  #handleOverflowMinimum = (event /** @type {OverflowMinimumEvent} */) => {
    this.#updateMenuVisibility(event.detail.minimumReached);
  };

  #updateMenuVisibility(hide) {
    if (hide) {
      this.refs.headerDrawerContainer.classList.remove('desktop:hidden');
      this.#menuDrawerHiddenWidth = window.innerWidth;
      this.refs.headerMenu.classList.add('hidden');
    } else {
      this.refs.headerDrawerContainer.classList.add('desktop:hidden');
      this.#menuDrawerHiddenWidth = null;
      this.refs.headerMenu.classList.remove('hidden');
    }
  }

  /* ------------------------------------------------------------------------
     MAIN SCROLL HANDLER
     – first block handles the hero-video layout
     – afterwards the untouched Dawn “scroll-up” logic
     ------------------------------------------------------------------------ */
  #handleWindowScroll = () => {
    /* ===== HERO VIDEO MODE ============================================= */
    if (this.#isHeroHeader) {
      const hero   = document.querySelector('#shopify-section-hero-video');
      const barGrp = document.querySelector('#header-group');
      if (!hero || !barGrp) return;

      /* hero is position:fixed, so its height is a constant */
      const heroHeight = hero.offsetHeight || window.innerHeight; // 100 svh fallback
      const headerH    = barGrp.offsetHeight;
      const trigger    = heroHeight - headerH;                    // slide-up point

      if (window.scrollY >= trigger) {
        barGrp.classList.add('header--is-sticky');
        this.classList.add('scrolled-down');     // logo flip ON
      } else {
        barGrp.classList.remove('header--is-sticky');
        this.classList.remove('scrolled-down');  // logo flip OFF
      }

      /* all sticky logic handled above – skip Dawn’s scroll-up block */
      return;
    }

    /* ===== ORIGINAL DAWN “scroll-up” LOGIC ============================= */
    const stickyMode = this.getAttribute('sticky');
    if (!this.#offscreen && stickyMode !== 'always') return;

    const scrollTop      = document.scrollingElement?.scrollTop ?? 0;
    const isScrollingUp  = scrollTop < this.#lastScrollTop;

    if (this.#timeout) {
      clearTimeout(this.#timeout);
      this.#timeout = null;
    }

    if (stickyMode === 'always') {
      if (isScrollingUp) {
        this.dataset.scrollDirection =
          this.getBoundingClientRect().top >= 0 ? 'none' : 'up';
      } else {
        this.dataset.scrollDirection = 'down';
      }
      this.#lastScrollTop = scrollTop;
      return;
    }

    if (isScrollingUp) {
      this.removeAttribute('data-animating');

      if (this.getBoundingClientRect().top >= 0) {
        this.#offscreen               = false;
        this.dataset.stickyState      = 'inactive';
        this.dataset.scrollDirection  = 'none';
      } else {
        this.dataset.stickyState      = 'active';
        this.dataset.scrollDirection  = 'up';
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
  /* -------------------------------------------------------------------- */

  /* ---------- lifecycle ------------------------------------------------ */
  connectedCallback() {
    /* detect if this header sits on a hero-video section */
    if (document.querySelector('#shopify-section-hero-video')) {
      this.#isHeroHeader = true;
    }

    super.connectedCallback();
    this.#resizeObserver.observe(this);
    this.addEventListener('overflowMinimum', this.#handleOverflowMinimum);

    const stickyMode = this.getAttribute('sticky');
    if (stickyMode) {
      this.#observeStickyPosition(stickyMode === 'always');

      if (stickyMode === 'scroll-up' || stickyMode === 'always') {
        document.addEventListener('scroll', this.#handleWindowScroll);
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#resizeObserver.disconnect();
    this.#intersectionObserver?.disconnect();
    this.removeEventListener('overflowMinimum', this.#handleOverflowMinimum);
    document.removeEventListener('scroll', this.#handleWindowScroll);
    document.body.style.setProperty('--header-height', '0px');
  }
}

/* ---------- register ---------- */
if (!customElements.get('header-component')) {
  customElements.define('header-component', HeaderComponent);
}

/* ---------- helper: update header-group height for the rest of the site ---------- */
onDocumentReady(() => {
  const header       = document.querySelector('#header-component');
  const headerGroup  = document.querySelector('#header-group');

  if (headerGroup) {
    const resizeObserver = new ResizeObserver(() =>
      calculateHeaderGroupHeight(header, headerGroup)
    );

    /* observe all current children */
    [...headerGroup.children].forEach((el) => {
      if (el !== header && el instanceof HTMLElement) resizeObserver.observe(el);
    });

    /* observe future child changes */
    const mutationObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          [...headerGroup.children].forEach((el) => {
            if (el !== header && el instanceof HTMLElement) resizeObserver.observe(el);
          });
        }
      }
    });
    mutationObserver.observe(headerGroup, { childList: true });
  }
});
