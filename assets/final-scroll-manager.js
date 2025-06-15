document.addEventListener('DOMContentLoaded', () => {
  const headerGroup = document.querySelector('#shopify-section-header-group');
  const heroSection = document.querySelector('#shopify-section-hero-video');
  const mainContent = document.querySelector('#MainContent');

  if (!headerGroup || !heroSection || !mainContent) {
    return;
  }

  // This function adds or removes the sticky class
  const handleScroll = () => {
    const triggerPoint = heroSection.offsetHeight;
    if (window.scrollY >= triggerPoint) {
      headerGroup.classList.add('header-is-sticky');
    } else {
      headerGroup.classList.remove('header-is-sticky');
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
      mainContent.scrollIntoView({ behavior: 'smooth' });
    });
  }
});