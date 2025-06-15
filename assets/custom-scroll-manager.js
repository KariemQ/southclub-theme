document.addEventListener('DOMContentLoaded', () => {
  const headerGroup = document.querySelector('#shopify-section-header-group');
  const headerComponent = document.querySelector('header-component');
  const mainContent = document.querySelector('#MainContent');

  if (!headerGroup || !headerComponent || !mainContent) {
    return;
  }

  const handleScroll = () => {
    // Trigger point is when the top of the main content reaches the top of the viewport
    const triggerPoint = mainContent.getBoundingClientRect().top;

    if (triggerPoint <= 0) {
      headerGroup.classList.add('header--is-sticky');
      headerComponent.classList.add('scrolled-down'); // Trigger logo animation
    } else {
      headerGroup.classList.remove('header--is-sticky');
      headerComponent.classList.remove('scrolled-down'); // Reset logo animation
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  const clickTriggers = document.querySelectorAll('.hero-video__wrapper, .hero-video__scroll-down');
  const scrollToContent = () => {
    mainContent.scrollIntoView({ behavior: 'smooth' });
  };

  clickTriggers.forEach(trigger => {
    if (trigger) {
      trigger.addEventListener('click', scrollToContent);
    }
  });
});