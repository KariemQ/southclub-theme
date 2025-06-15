document.addEventListener('DOMContentLoaded', () => {
  const scrollTriggerArrow = document.querySelector('.hero-video__scroll-down');
  const mainContent = document.querySelector('#MainContent');

  if (scrollTriggerArrow && mainContent) {
    scrollTriggerArrow.addEventListener('click', () => {
      mainContent.scrollIntoView({
        behavior: 'smooth'
      });
    });
  }
});