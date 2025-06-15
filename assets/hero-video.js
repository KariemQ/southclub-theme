document.addEventListener('DOMContentLoaded', () => {
  const videoSection = document.querySelector('[data-video-section]');
  if (!videoSection) return;

  const scrollTargetSelector = videoSection.dataset.scrollTarget;
  const scrollTargetElement = document.querySelector(scrollTargetSelector);

  if (!scrollTargetElement) return;

  videoSection.addEventListener('click', () => {
    scrollTargetElement.scrollIntoView({ behavior: 'smooth' });
  });
});