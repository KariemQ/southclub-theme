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
  let hasReachedTrigger = false; // Track if we've ever reached the trigger point

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        const headerHeight = headerGroup.offsetHeight;
        
        // Trigger point: when header would reach the top
        const triggerPoint = heroHeight - headerHeight;
        
        // Add a small buffer to prevent glitchy behavior
        const buffer = 10;

        // Only allow sticky behavior if we've scrolled past the trigger point
        if (scrollY >= (triggerPoint - buffer)) {
          hasReachedTrigger = true;
          
          if (!isSticky) {
            headerGroup.classList.add('header--is-sticky');
            headerComponent.classList.add('scrolled-down');
            document.body.classList.add('header-is-sticky');
            isSticky = true;
          }
        } else if (scrollY < (triggerPoint - buffer) && isSticky && hasReachedTrigger) {
          // Only remove sticky if we've moved significantly away from trigger
          headerGroup.classList.remove('header--is-sticky');
          headerComponent.classList.remove('scrolled-down');
          document.body.classList.remove('header-is-sticky');
          isSticky = false;
          
          // Reset the trigger flag only if we're significantly above the trigger point
          if (scrollY < (triggerPoint - buffer * 5)) {
            hasReachedTrigger = false;
          }
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
    
    // Force trigger the sticky state when clicking
    hasReachedTrigger = true;
    
    window.scrollTo({
      top: heroHeight - headerHeight + 1,
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

  // Initial check - but don't set hasReachedTrigger on load
  const initialCheck = () => {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    const headerHeight = headerGroup.offsetHeight;
    const triggerPoint = heroHeight - headerHeight;
    
    // Only set sticky if we're already past the trigger on page load
    if (scrollY >= triggerPoint) {
      hasReachedTrigger = true;
      headerGroup.classList.add('header--is-sticky');
      headerComponent.classList.add('scrolled-down');
      document.body.classList.add('header-is-sticky');
      isSticky = true;
    }
  };
  
  initialCheck();
  
  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Reset state on resize to recalculate positions
      isSticky = false;
      hasReachedTrigger = false;
      headerGroup.classList.remove('header--is-sticky');
      headerComponent.classList.remove('scrolled-down');
      document.body.classList.remove('header-is-sticky');
      initialCheck();
    }, 100);
  });
});