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
    let lastScrollY = window.pageYOffset;
    let transitionTimeout = null;

    // Calculate scroll trigger point
    function getTriggerPoint() {
      const heroHeight = heroSection.offsetHeight;
      const headerHeight = headerGroup.offsetHeight;
      return heroHeight - headerHeight;
    }

    // Handle scroll events with smoother transitions
    function handleScroll() {
      const scrollY = window.pageYOffset;
      const triggerPoint = getTriggerPoint();
      const shouldBeSticky = scrollY >= triggerPoint;
      
      // Only update if state changed to prevent unnecessary reflows
      if (shouldBeSticky !== isSticky) {
        // Prevent any teleportation by handling transition states properly
        if (shouldBeSticky) {
          // First add transition class
          headerGroup.classList.add('header--transition');
          
          // Then after a tiny delay, add sticky class
          clearTimeout(transitionTimeout);
          transitionTimeout = setTimeout(() => {
            headerGroup.classList.add('header--is-sticky');
            if (headerComponent) {
              headerComponent.classList.add('scrolled-down');
            }
          }, 10);
        } else {
          // For removing sticky, do it in reverse
          headerGroup.classList.add('header--transition');
          headerGroup.classList.remove('header--is-sticky');
          if (headerComponent) {
            headerComponent.classList.remove('scrolled-down');
          }
          
          // Keep transition active for a bit
          clearTimeout(transitionTimeout);
          transitionTimeout = setTimeout(() => {
            headerGroup.classList.remove('header--transition');
          }, 300);
        }
        
        isSticky = shouldBeSticky;
      }
      
      // Track last scroll position for direction detection
      lastScrollY = scrollY;
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

    // Add arrow if it doesn't exist yet
    if (!document.querySelector('.hero-video__scroll-down')) {
      const arrowElement = document.createElement('div');
      arrowElement.className = 'hero-video__scroll-down';
      arrowElement.innerHTML = `
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L10 10L19 1" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
      arrowElement.setAttribute('tabindex', '0');
      arrowElement.setAttribute('role', 'button');
      arrowElement.setAttribute('aria-label', 'Scroll down');
      
      // Add to hero section if it exists
      if (heroSection) {
        heroSection.appendChild(arrowElement);
      }
    }

    // Initialize scroll state
    handleScroll();

    console.log('🚀 Hero Video Manager: Initialized successfully');
  }
})();