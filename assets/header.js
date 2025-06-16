/* ================================================================
   South-Club custom header – hero-video variant
   (v1.1 – robust hero selector + tiny guard)
   ================================================================ */
import { Component } from '@theme/component';
import { onDocumentReady } from '@theme/utilities';

class HeaderComponent extends Component {
  requiredRefs = ['headerDrawerContainer', 'headerMenu', 'headerRowTop'];

  #resizeObserver = new ResizeObserver(([entry]) => {
    if (entry)
      document.body.style.setProperty(
        '--header-height',
        `${entry.target.getBoundingClientRect().height}px`
      );
  });

  #isHeroHeader = false;
  #lastScrollTop = 0;
  #offscreen = false;
  #timeout = null;
  #animationDelay = 150;

  /* ─────────────────────────────────────────────
     HERO scroll routine
     ──────────────────────────────────────────── */
  #handleWindowScroll = () => {
    if (this.#isHeroHeader) {
      const headerGroup = document.querySelector('#header-group');
      if (!headerGroup) return;

      /* ---------------- CHANGE ① ---------------- */
      const hero = document.querySelector(
        '[id^="shopify-section"][id$="hero-video"]'
      );
      if (!hero) return; // ← extra guard for 404 etc.

      const trigger = window.innerHeight - headerGroup.offsetHeight;

      if (window.scrollY >= trigger) {
        headerGroup.classList.add('header--is-sticky');
        this.classList.add('scrolled-down');
      } else {
        headerGroup.classList.remove('header--is-sticky');
        this.classList.remove('scrolled-down');
      }
      return; // skip theme’s default “scroll-up” logic
    }

    /* default Dawn behaviour unchanged … */
  };

  connectedCallback() {
    /* ---------------- CHANGE ② ---------------- */
    if (
      document.querySelector('[id^="shopify-section"][id$="hero-video"]')
    ) {
      this.#isHeroHeader = true;
    }

    super.connectedCallback();
    this.#resizeObserver.observe(this);
    document.addEventListener('scroll', this.#handleWindowScroll);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#resizeObserver.disconnect();
    document.removeEventListener('scroll', this.#handleWindowScroll);
  }
}

/* register once */
if (!customElements.get('header-component')) {
  customElements.define('header-component', HeaderComponent);
}

/* keep --header-height in sync on first paint */
onDocumentReady(() => {
  const headerGroup = document.querySelector('#header-group');
  if (headerGroup)
    document.body.style.setProperty(
      '--header-height',
      `${headerGroup.offsetHeight}px`
    );
});
