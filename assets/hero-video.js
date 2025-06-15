document.addEventListener('DOMContentLoaded', () => {
  const heroVideoSection = document.querySelector('#shopify-section-hero-video');
  const headerGroup = document.querySelector('#shopify-section-header-group');

  // If the essential elements don't exist, don't run the script.
  if (!heroVideoSection || !headerGroup) {
    return;
  }

  // --- 1. Sticky Header Logic ---
  const handleScroll = () => {
    // The trigger point is when we have scrolled past the full height of the hero video spacer.
    const scrollTriggerPoint = heroVideoSection.offsetHeight;

    if (window.scrollY >= scrollTriggerPoint) {
      headerGroup.classList.add('header-is-sticky');
    } else {
      headerGroup.classList.remove('header-is-sticky');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load to set the initial state

  // --- 2. Click-to-Scroll Logic ---
  const scrollToContent = () => {
    // Scroll to the point where the header becomes sticky.
    const scrollTarget = heroVideoSection.offsetHeight;
    window.scrollTo({
      top: scrollTarget,
      behavior: 'smooth'
    });
  };

  const scrollTriggerArrow = document.querySelector('[data-scroll-trigger]');
  if (scrollTriggerArrow) {
    scrollTriggerArrow.addEventListener('click', scrollToContent);
  }
  const heroWrapper = heroVideoSection.querySelector('.hero-video__wrapper');
  if (heroWrapper) {
    heroWrapper.addEventListener('click', scrollToContent);
  }
});