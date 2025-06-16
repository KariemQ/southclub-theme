/*  assets/header.js  – sentinel version  */
import { Component } from '@theme/component';
import { onDocumentReady, changeMetaThemeColor } from '@theme/utilities';

/* ----------------------------------------------------------------------
   Header component (Dawn boiler-plate + hero-video additions)
   ------------------------------------------------------------------- */
class HeaderComponent extends Component {
  requiredRefs = ['headerDrawerContainer', 'headerMenu', 'headerRowTop'];

  #menuDrawerHiddenWidth = null;
  #intersectionObserver  = null;
  #offscreen             = false;
  #lastScrollTop         = 0;
  #timeout               = null;
  #animationDelay        = 150;
  #isHeroHeader          = false;

  #resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const { height } = entry.target.getBoundingClientRect();
    document.body.style.setProperty('--header-height', `${height}px`);

    if (this.#menuDrawerHiddenWidth && window.innerWidth > this.#menuDrawerHiddenWidth) {
      this.#updateMenuVisibility(false);
    }
  });

  /* =============== HERO SENTINEL SET-UP ============================== */
  #createHeroObserver() {
    const hero    = document.querySelector('#shopify-section-hero-video');
    const barGrp  = document.querySelector('#header-group');
    if (!hero || !barGrp) return;

    /* 1 px sentinel that sits right after the hero */
    const sentinel = document.createElement('div');
    sentinel.id    = 'hero-sticky-trigger';
    sentinel.style.cssText = 'position:relative;width:100%;height:1px;';
    hero.insertAdjacentElement('afterend', sentinel);

    /* Watch when the sentinel leaves the viewport (top ≤ 0) */
    const io = new IntersectionObserver(
      ([entry]) => {
        const isPastHero = entry.boundingClientRect.top < 0;
        barGrp.classList.toggle('header--is-sticky', isPastHero);
        this.classList.toggle('scrolled-down',               isPastHero);
      },
      { root: null, threshold: 0 }
    );

    io.observe(sentinel);
  }

  /* =============== DAWN’S ORIGINAL “scroll-up” HANDLER =============== */
  #handleWindowScroll = () => {
    const stickyMode = this.getAttribute('sticky');
    if (!this.#offscreen && stickyMode !== 'always') return;

    const scrollTop     = document.scrollingElement?.scrollTop ?? 0;
    const isScrollingUp = scrollTop < this.#lastScrollTop;

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
        this.#offscreen              = false;
        this.dataset.stickyState     = 'inactive';
        this.dataset.scrollDirection = 'none';
      } else {
        this.dataset.stickyState     = 'active';
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

  /* ===================  LIFECYCLE HOOKS ============================== */
  connectedCallback() {
    /* Detect hero-video presence once */
    if (document.querySelector('#shopify-section-hero-video')) {
      this.#isHeroHeader = true;
      this.#createHeroObserver();   // <-- sentinel magic
    }

    super.connectedCallback();
    this.#resizeObserver.observe(this);
    this.addEventListener('overflowMinimum', (e) =>
      this.#updateMenuVisibility(e.detail.minimumReached)
    );

    const stickyMode = this.getAttribute('sticky');
    if (stickyMode) {
      this.#observeStickyPosition(stickyMode === 'always');
      if (stickyMode === 'scroll-up' || stickyMode === 'always') {
        document.addEventListener('scroll', this.#handleWindowScroll, { passive: true });
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#resizeObserver.disconnect();
    this.#intersectionObserver?.disconnect();
    document.removeEventListener('scroll', this.#handleWindowScroll);
    document.body.style.setProperty('--header-height', '0px');
  }

  /* ===== Helpers copied from Dawn (unchanged) ======================== */
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

  #observeStickyPosition(alwaysSticky = true) {
    if (this.#intersectionObserver) return;
    this.#intersectionObserver = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      const { isIntersecting } = entry;

      if (alwaysSticky) {
        this.dataset.stickyState = isIntersecting ? 'inactive' : 'active';
        changeMetaThemeColor(this.refs.headerRowTop);
      } else {
        this.#offscreen = !isIntersecting || this.dataset.stickyState === 'active';
      }
    }, { threshold: alwaysSticky ? 1 : 0 });

    this.#intersectionObserver.observe(this);
  }
}

/* register the custom element once */
if (!customElements.get('header-component')) {
  customElements.define('header-component', HeaderComponent);
}

/* ---- keep --header-group-height up to date (from Dawn) -------------- */
onDocumentReady(() => {
  const header      = document.querySelector('#header-component');
  const headerGroup = document.querySelector('#header-group');

  if (!headerGroup) return;

  const resizeObserver = new ResizeObserver(() =>
    calculateHeaderGroupHeight(header, headerGroup)
  );

  [...headerGroup.children].forEach((el) => {
    if (el !== header && el instanceof HTMLElement) resizeObserver.observe(el);
  });

  new MutationObserver(() => {
    [...headerGroup.children].forEach((el) => {
      if (el !== header && el instanceof HTMLElement) resizeObserver.observe(el);
    });
  }).observe(headerGroup, { childList: true });
});
