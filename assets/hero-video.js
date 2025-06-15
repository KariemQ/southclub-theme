document.addEventListener('DOMContentLoaded', () => {
  const heroVideoSection = document.querySelector('#shopify-section-hero-video');
  const headerGroup = document.querySelector('#shopify-section-header-group');
  const scrollTrigger = document.querySelector('[data-scroll-trigger]');

  // If the essential elements don't exist, don't run the script.
  if (!heroVideoSection || !headerGroup) {
    return;
  }

  // --- 1. Sticky Header Logic ---
  const handleScroll = () => {
    // Get the position of the hero section relative to the viewport.
    const heroBottom = heroVideoSection.getBoundingClientRect().bottom;

    // When the bottom of the hero spacer reaches the top of the viewport (or passes it),
    // add the sticky class to the header. Otherwise, remove it.
    if (heroBottom <= 0) {
      headerGroup.classList.add('header-is-sticky');
    } else {
      headerGroup.classList.remove('header-is-sticky');
    }
  };

  // Listen for scroll events to run the function.
  window.addEventListener('scroll', handleScroll, { passive: true });
  // Run it once on load in case the page is already scrolled.
  handleScroll();


  // --- 2. Click-to-Scroll Logic ---
  const scrollToContent = () => {
    // Scroll the window to the exact height of the hero spacer.
    // This brings the header perfectly to the top of the screen.
    window.scrollTo({
      top: heroVideoSection.offsetHeight,
      behavior: 'smooth' // This creates the smooth scrolling animation.
    });
  };

  // Attach the scroll function to the arrow.
  if (scrollTrigger) {
    scrollTrigger.addEventListener('click', scrollToContent);
  }

  // Attach the scroll function to the entire video wrapper as well.
  const heroWrapper = heroVideoSection.querySelector('.hero-video__wrapper');
  if (heroWrapper) {
    heroWrapper.addEventListener('click', scrollToContent);
  }
});