document.addEventListener('DOMContentLoaded', () => {
  const headerGroup = document.querySelector('#header-group');
  const headerComponent = document.querySelector('header-component');
  const mainContent = document.querySelector('#MainContent');
  const heroSection = document.querySelector('[id^="shopify-section"][id$="hero-video"]');

  // Only run this script if we have all required elements including hero video
  if (!headerGroup || !headerComponent || !mainContent || !heroSection) {
    return;
  }

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

    // Calculate trigger point based on main content position
    const mainContentRect = mainContent.getBoundingClientRect();
    const headerHeight = headerGroup.offsetHeight;
    
    // Trigger when main content is about to reach the top
    const triggerPoint = mainContentRect.top - headerHeight;

    if (triggerPoint <= 0) {
      headerGroup.classList.add('header--is-sticky');
      headerComponent.classList.add('scrolled-down');
    } else {
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

  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Run once on load
  handleScroll();

  // Smooth scroll functionality for hero video clicks
  const clickTriggers = document.querySelectorAll('.hero-video__wrapper, .hero-video__scroll-down');
  const scrollToContent = (e) => {
    e.preventDefault();
    
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
      trigger.style.cursor = 'pointer'; // Make it clear it's clickable
    }
  });
});