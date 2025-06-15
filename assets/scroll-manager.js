document.addEventListener('DOMContentLoaded', () => {
  const headerGroup = document.querySelector('#shopify-section-header-group');
  const headerComponent = document.querySelector('header-component'); // The element with the logo animation
  const heroSection = document.querySelector('#shopify-section-hero-video');
  const mainContent = document.querySelector('#MainContent');

  if (!headerGroup || !heroSection || !mainContent || !headerComponent) {
    return;
  }

  // This function handles all our scroll-based logic
  const handleScroll = () => {
    // The point where the header should become sticky
    const triggerPoint = heroSection.offsetHeight;

    if (window.scrollY >= triggerPoint) {
      // We are past the hero video
      headerGroup.classList.add('header-is-sticky');
      // Add the 'scrolled-down' class to trigger the logo animation
      headerComponent.classList.add('scrolled-down');
    } else {
      // We are still in the hero video view
      headerGroup.classList.remove('header-is-sticky');
      // Remove the 'scrolled-down' class so the logo animation resets
      headerComponent.classList.remove('scrolled-down');
    }
  };

  // Listen for scroll events
  window.addEventListener('scroll', handleScroll, { passive: true });
  // Run once on load to set the correct initial state
  handleScroll();

  // This handles the click-to-scroll on the arrow
  const scrollTriggerArrow = document.querySelector('.hero-video__scroll-down');
  if (scrollTriggerArrow) {
    scrollTriggerArrow.addEventListener('click', () => {
      // Scroll to the top of the main content, which is where the header becomes sticky
      mainContent.scrollIntoView({ behavior: 'smooth' });
    });
  }
});