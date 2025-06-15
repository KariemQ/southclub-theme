document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.querySelector('#MainContent');
  if (!mainContent) return;

  const scrollToContent = () => {
    mainContent.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const scrollTriggerArrow = document.querySelector('.hero-video__scroll-down');
  if (scrollTriggerArrow) {
    scrollTriggerArrow.addEventListener('click', scrollToContent);
  }

  const heroWrapper = document.querySelector('#shopify-section-hero-video .hero-video__wrapper');
  if (heroWrapper) {
    heroWrapper.addEventListener('click', scrollToContent);
  }
});