document.addEventListener('DOMContentLoaded', () => {
  const headerGroup = document.querySelector('#shopify-section-header-group');
  const foreground = document.querySelector('.site-foreground');
  const mainContent = document.querySelector('#MainContent');

  if (!headerGroup || !foreground || !mainContent) return;

  const handleScroll = () => {
    const triggerPoint = foreground.getBoundingClientRect().top;

    // Manually set the data-attribute the theme uses
    if (triggerPoint <= 0) {
      headerGroup.setAttribute('data-sticky-state', 'active');
    } else {
      headerGroup.setAttribute('data-sticky-state', 'inactive');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Click to Scroll ---
  const videoWrapper = document.querySelector('.site-background');
  const scrollToContent = () => {
    mainContent.scrollIntoView({ behavior: 'smooth' });
  };
  if (videoWrapper) videoWrapper.addEventListener('click', scrollToContent);

  // We assume the arrow is in your hero-video.liquid file
  const scrollTriggerArrow = document.querySelector('.hero-video__scroll-down');
  if (scrollTriggerArrow) scrollTriggerArrow.addEventListener('click', scrollToContent);
});