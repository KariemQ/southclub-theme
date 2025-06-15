document.addEventListener('DOMContentLoaded', () => {
  const headerComponent = document.querySelector('header-component');
  if (!headerComponent) return;

  // This function will add or remove a CSS class if the page is scrolled.
  const handleScroll = () => {
    if (window.scrollY > 20) {
      headerComponent.classList.add('scrolled-down');
    } else {
      headerComponent.classList.remove('scrolled-down');
    }
  };

  // Listen for scroll events
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Run on page load as well
  handleScroll();
});