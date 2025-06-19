document.addEventListener('DOMContentLoaded', () => {
  const headerGroup = document.querySelector('#header-group');
  const headerComponent = document.querySelector('header-component');
  const mainContent = document.querySelector('#MainContent');
  const heroSection = document.querySelector('.hero-section');

  if (!headerGroup || !headerComponent || !mainContent || !heroSection) {
    console.warn('Hero video scroll manager: Required elements not found');
    return;
  }

  let isSticky = false;
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        const headerHeight = headerGroup.offsetHeight;
        
        // Trigger point: when header reaches the top
        const triggerPoint = heroHeight - headerHeight;

        if (scrollY >= triggerPoint && !isSticky) {
          headerGroup.classList.add('header--is-sticky');
          headerComponent.classList.add('scrolled-down');
          
          // Add body class for additional styling if needed
          document.body.classList.add('header-is-sticky');
          isSticky = true;
          
        } else if (scrollY < triggerPoint && isSticky) {
          headerGroup.classList.remove('header--is-sticky');
          headerComponent.classList.remove('scrolled-down');
          
          document.body.classList.remove('header-is-sticky');
          isSticky = false;
        }
        
        ticking = false;
      });
      ticking = true;
    }
  };

  // Smooth scroll to content function
  const scrollToContent = (event) => {
    event.preventDefault();
    const heroHeight = heroSection.offsetHeight;
    const headerHeight = headerGroup.offsetHeight;
    
    window.scrollTo({
      top: heroHeight - headerHeight + 1, // +1 to ensure sticky state triggers
      behavior: 'smooth'
    });
  };

  // Event listeners
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Click handlers for video and arrow
  const clickTriggers = document.querySelectorAll('.hero-video__wrapper, .hero-video__scroll-down');
  clickTriggers.forEach(trigger => {
    if (trigger) {
      trigger.addEventListener('click', scrollToContent);
    }
  });

  // Initial check on load
  handleScroll();
  
  // Handle resize events
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      handleScroll();
    }, 100);
  });
});