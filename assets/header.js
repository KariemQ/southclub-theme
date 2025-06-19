/* ================================================================
   South-Club custom header – hero-video variant
   (v2.0 – unified scroll management)
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

  /* ─────────────────────────────────────────────
     HERO scroll routine - disabled in favor of custom-scroll-manager
     ──────────────────────────────────────────── */
  #handleWindowScroll = () => {
    // Skip all scroll handling if we have a hero video
    // Let custom-scroll-manager.js handle everything
    if (this.#isHeroHeader) {
      return;
    }

    /* default Dawn behaviour for non-hero pages can go here if needed */
  };

  connectedCallback() {
    // Detect if we have a hero video section
    if (document.querySelector('[id^="shopify-section"][id$="hero-video"]')) {
      this.#isHeroHeader = true;
    }

    super.connectedCallback();
    this.#resizeObserver.observe(this);
    
    // Only add scroll listener for non-hero pages
    if (!this.#isHeroHeader) {
      document.addEventListener('scroll', this.#handleWindowScroll);
    }
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