document.addEventListener('DOMContentLoaded', () => {
  // Fix: Use correct selector that matches your HTML structure
  const headerGroup = document.querySelector('#header-group');
  const headerComponent = document.querySelector('header-component');
  const mainContent = document.querySelector('#MainContent');
  const heroSection = document.querySelector('.hero-section');

  // Only run if we have all required elements including hero
  if (!headerGroup || !headerComponent || !mainContent || !heroSection) {
    console.log('Hero scroll manager: Required elements not found', {
      headerGroup: !!headerGroup,
      headerComponent: !!headerComponent,
      mainContent: !!mainContent,
      heroSection: !!heroSection
    });
    return;
  }

  console.log('Hero scroll manager: Initialized');

  let isSticky = false;
  let ticking = false;

  const handleScroll = () => {
    // Get current scroll position
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // Get hero section height
    const heroHeight = heroSection.offsetHeight;
    const headerHeight = headerGroup.offsetHeight;
    
    // Calculate trigger point - when we've scrolled past hero minus header height
    const triggerPoint = heroHeight - headerHeight;

    // Determine if header should be sticky
    const shouldBeSticky = scrollY >= triggerPoint;

    // Only update if state changed (prevents constant updates)
    if (shouldBeSticky !== isSticky) {
      isSticky = shouldBeSticky;
      
      if (isSticky) {
        console.log('Making header sticky at scroll:', scrollY);
        headerGroup.classList.add('header--is-sticky');
        headerComponent.classList.add('scrolled-down');
      } else {
        console.log('Making header non-sticky at scroll:', scrollY);
        headerGroup.classList.remove('header--is-sticky');
        headerComponent.classList.remove('scrolled-down');
      }
    }
  };

  // Throttled scroll handler
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  // Add scroll listener
  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Run once on load to set initial state
  handleScroll();

  // Smooth scroll functionality for hero video clicks
  const clickTriggers = document.querySelectorAll('.hero-video__wrapper, .hero-video__scroll-down');
  const scrollToContent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Scrolling to content');
    
    // Get hero section height and header height
    const heroHeight = heroSection.offsetHeight;
    const headerHeight = headerGroup.offsetHeight;
    
    // Target position: just past the hero section
    const targetPosition = heroHeight - headerHeight + 1;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  };

  clickTriggers.forEach(trigger => {
    if (trigger) {
      trigger.addEventListener('click', scrollToContent);
      trigger.style.cursor = 'pointer';
    }
  });

  // Add keyboard support for accessibility
  clickTriggers.forEach(trigger => {
    if (trigger) {
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          scrollToContent(e);
        }
      });
    }
  });
});