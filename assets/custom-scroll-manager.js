document.addEventListener('DOMContentLoaded', () => {
  const headerGroup = document.querySelector('#header-group');
  const headerComponent = document.querySelector('header-component');
  const mainContent = document.querySelector('#MainContent');
  const heroSection = document.querySelector('.hero-section');

  if (!headerGroup || !headerComponent || !mainContent || !heroSection) {
    return;
  }

  let isSticky = false;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    const headerHeight = headerGroup.offsetHeight;
    
    // Trigger point: when we've scrolled past the hero minus header height
    const triggerPoint = heroHeight - headerHeight;

    if (scrollY >= triggerPoint && !isSticky) {
      headerGroup.classList.add('header--is-sticky');
      headerComponent.classList.add('scrolled-down');
      isSticky = true;
    } else if (scrollY < triggerPoint && isSticky) {
      headerGroup.classList.remove('header--is-sticky');
      headerComponent.classList.remove('scrolled-down');
      isSticky = false;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load

  // Handle click on video or arrow to scroll to content
  const clickTriggers = document.querySelectorAll('.hero-video__wrapper, .hero-video__scroll-down');
  const scrollToContent = () => {
    const heroHeight = heroSection.offsetHeight;
    const headerHeight = headerGroup.offsetHeight;
    
    window.scrollTo({
      top: heroHeight - headerHeight,
      behavior: 'smooth'
    });
  };

  clickTriggers.forEach(trigger => {
    if (trigger) {
      trigger.addEventListener('click', scrollToContent);
    }
  });
});