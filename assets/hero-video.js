document.addEventListener('DOMContentLoaded', () => {
  const headerGroup = document.querySelector('#shopify-section-header-group');
  const heroVideoSection = document.querySelector('#shopify-section-hero-video');

  if (!headerGroup || !heroVideoSection) {
    return;
  }

  // --- 1. Sticky Header Logic ---
  const handleScroll = () => {
    // The trigger point is the height of the hero spacer section.
    const scrollTriggerPoint = heroVideoSection.offsetHeight;

    if (window.scrollY >= scrollTriggerPoint) {
      headerGroup.classList.add('header-is-sticky');
    } else {
      headerGroup.classList.remove('header-is-sticky');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // --- 2. Click-to-Scroll Logic ---
  const scrollToContent = () => {
    // Scroll to the end of the hero spacer, which is the start of the main content.
    window.scrollTo({
      top: heroVideoSection.offsetHeight,
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