// Hero Video + Header Management - Clean Implementation
(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('🎬 Hero Video Manager: Starting...');

    // Get required elements
    const heroSection = document.querySelector('.hero-section');
    const headerGroup = document.querySelector('#header-group');
    const headerComponent = document.querySelector('header-component');
    const mainContent = document.querySelector('#MainContent');

    // Check if we have all required elements
    if (!heroSection || !headerGroup || !mainContent) {
      console.log('❌ Hero Video Manager: Required elements not found');
      return;
    }

    console.log('✅ Hero Video Manager: All elements found');

    // State management
    let isSticky = false;
    let ticking = false;

    // Calculate scroll trigger point
    function getTriggerPoint() {
      const heroHeight = heroSection.offsetHeight;
      const headerHeight = headerGroup.offsetHeight;
      return heroHeight - headerHeight;
    }

    // Handle scroll events
    function handleScroll() {
      const scrollY = window.pageYOffset;
      const triggerPoint = getTriggerPoint();
      const shouldBeSticky = scrollY >= triggerPoint;

      // Only update if state changed
      if (shouldBeSticky !== isSticky) {
        isSticky = shouldBeSticky;
        
        if (isSticky) {
          console.log('📌 Making header sticky');
          headerGroup.classList.add('header--is-sticky');
          if (headerComponent) {
            headerComponent.classList.add('scrolled-down');
          }
        } else {
          console.log('📍 Making header non-sticky');
          headerGroup.classList.remove('header--is-sticky');
          if (headerComponent) {
            headerComponent.classList.remove('scrolled-down');
          }
        }
      }
    }

    // Throttled scroll handler
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Smooth scroll to content
    function scrollToContent(event) {
      event.preventDefault();
      event.stopPropagation();
      
      console.log('🎯 Scrolling to main content');
      
      const triggerPoint = getTriggerPoint();
      const targetPosition = triggerPoint + 10; // Just past the trigger point
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }

    // Set up scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });

    // Set up click handlers for video and arrow
    const clickTargets = document.querySelectorAll('.hero-video__wrapper, .hero-video__scroll-down');
    clickTargets.forEach(target => {
      target.addEventListener('click', scrollToContent);
      
      // Add keyboard support
      target.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          scrollToContent(event);
        }
      });
    });

    // Initialize scroll state
    handleScroll();

    console.log('🚀 Hero Video Manager: Initialized successfully');
  }
})();