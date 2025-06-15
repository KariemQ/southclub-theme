document.addEventListener('DOMContentLoaded', () => {
  const scrollTrigger = document.querySelector('[data-scroll-trigger]');
  const mainContent = document.querySelector('#MainContent');

  if (!scrollTrigger || !mainContent) return;

  // When the arrow is clicked, scroll to the start of the main content
  scrollTrigger.addEventListener('click', () => {
    mainContent.scrollIntoView({ behavior: 'smooth' });
  });
});