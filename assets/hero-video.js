document.addEventListener('DOMContentLoaded', () => {
  const headerGroup = document.querySelector('#shopify-section-header-group');
  const mainContent = document.querySelector('#MainContent');

  if (!headerGroup || !mainContent) return;

  // --- 1. Sticky Header Logic ---
  const handleScroll = () => {
    // Get the top position of the main content area.
    const mainContentTop = mainContent.getBoundingClientRect().top;

    // When the top of the main content reaches the top of the viewport, make the header sticky.
    if (mainContentTop <= 0) {
      headerGroup.classList.add('header-is-sticky');
    } else {
      headerGroup.classList.remove('header-is-sticky');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load to set the initial state

  // --- 2. Click-to-Scroll Logic ---
  const scrollToContent = () => {
    // Scroll smoothly to the main content section.
    mainContent.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const scrollTriggerArrow = document.querySelector('[data-scroll-trigger]');
  if (scrollTriggerArrow) {
    scrollTriggerArrow.addEventListener('click', scrollToContent);
  }

  const heroWrapper = document.querySelector('#shopify-section-hero-video .hero-video__wrapper');
  if (heroWrapper) {
    heroWrapper.addEventListener('click', scrollToContent);
  }
});