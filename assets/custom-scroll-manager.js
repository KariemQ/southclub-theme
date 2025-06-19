document.addEventListener('DOMContentLoaded', () => {
  // Fix: Use correct selector that matches your HTML structure
  const headerGroup = document.querySelector('#header-group');
  const headerComponent = document.querySelector('header-component');
  const mainContent = document.querySelector('#MainContent');
  const heroSection = document.querySelector('.hero-section');

  // Only run if we have all required elements including hero
  if (!headerGroup || !headerComponent || !mainContent || !heroSection) {
    console.log('Hero scroll manager: Required elements not found');
    return;
  }

  console.log('Hero scroll manager: Initialized');

  let isScrolling = false;
  let scrollTimeout;

  const handleScroll = () => {
    // Clear any existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Mark that we're scrolling
    if (!isScrolling) {
      isScrolling = true;
      document.body.classList.add('is-scrolling');
    }

    // Calculate when main content reaches viewport top
    const mainContentRect = mainContent.getBoundingClientRect();
    const headerHeight = headerGroup.offsetHeight;
    
    // Trigger when main content is about to reach the top
    const triggerPoint = mainContentRect.top - headerHeight;

    if (triggerPoint <= 0) {
      // Header should be sticky at top
      headerGroup.classList.add('header--is-sticky');
      headerComponent.classList.add('scrolled-down');
    } else {
      // Header should be at bottom of hero
      headerGroup.classList.remove('header--is-sticky');
      headerComponent.classList.remove('scrolled-down');
    }

    // Set timeout to detect when scrolling ends
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      document.body.classList.remove('is-scrolling');
    }, 150);
  };

  // Use requestAnimationFrame for smoother performance
  let ticking = false;
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
    
    // Calculate the exact position where header should be at top
    const headerHeight = headerGroup.offsetHeight;
    const targetPosition = mainContent.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    
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
});