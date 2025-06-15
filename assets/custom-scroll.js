document.addEventListener('DOMContentLoaded', () => {
  const headerGroup = document.querySelector('#shopify-section-header-group');
  const heroSection = document.querySelector('#shopify-section-hero-video');
  const mainContent = document.querySelector('#MainContent'); // We still need this for the click

  if (!headerGroup || !heroSection || !mainContent) {
    return;
  }

  // --- Logic to toggle the sticky class ---
  const handleScroll = () => {
    // The point to trigger the change is when we scroll past the hero section
    const triggerPoint = heroSection.offsetHeight;

    if (window.scrollY >= triggerPoint) {
      headerGroup.classList.add('header-is-sticky');
    } else {
      headerGroup.classList.remove('header-is-sticky');
    }
  };

  // Run the function when the page loads and on every scroll
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  // --- Logic for the click-to-scroll arrow ---
  const scrollTriggerArrow = document.querySelector('.hero-video__scroll-down');
  if (scrollTriggerArrow) {
    scrollTriggerArrow.addEventListener('click', () => {
      // When clicked, scroll to the start of the main content
      mainContent.scrollIntoView({
        behavior: 'smooth'
      });
    });
  }
});