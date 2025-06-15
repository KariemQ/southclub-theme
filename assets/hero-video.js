document.addEventListener('DOMContentLoaded', () => {
  const headerGroup = document.querySelector('#shopify-section-header-group');
  const heroSection = document.querySelector('#shopify-section-hero-video');
  const scrollTrigger = document.querySelector('[data-scroll-trigger]');

  if (!headerGroup || !heroSection) return;

  // The point at which the header should become sticky
  const stickyTriggerPoint = heroSection.offsetTop;

  const handleScroll = () => {
    // When scroll position is past the bottom of the hero section, make the header sticky
    if (window.scrollY >= stickyTriggerPoint) {
      headerGroup.classList.add('header-is-sticky');
    } else {
      headerGroup.classList.remove('header-is-sticky');
    }
  };

  const scrollToContent = () => {
    // Scroll to the top of the hero section, which will trigger the header to become sticky
    window.scrollTo({
      top: stickyTriggerPoint,
      behavior: 'smooth'
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Check position on page load
  handleScroll();

  // Add click listener to the scroll down arrow
  if (scrollTrigger) {
    scrollTrigger.addEventListener('click', scrollToContent);
  }
});