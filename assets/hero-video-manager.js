(function() {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('🎬 Hero Video Manager: Starting...');

    const heroSection = document.querySelector('.hero-section');
    const headerGroup = document.querySelector('#header-group');
    const headerComponent = document.querySelector('header-component');
    const mainContent = document.querySelector('#MainContent');

    if (!heroSection || !headerGroup || !mainContent) {
      console.log('❌ Hero Video Manager: Required elements not found');
      return;
    }

    let isSticky = false;
    let ticking = false;

    // By subtracting slightly less than the full header height, you can trigger earlier without jump
    function getTriggerPoint() {
      const heroHeight = heroSection.offsetHeight;
      const headerHeight = headerGroup.offsetHeight;
      const offset = 16; // Adjust as needed to prevent teleport/jump (e.g., 0, 8, 20, etc.)
      return heroHeight - headerHeight + offset;
    }

    function handleScroll() {
      const scrollY = window.pageYOffset;
      const triggerPoint = getTriggerPoint();
      const shouldBeSticky = scrollY >= triggerPoint;

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

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function() {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Scroll past the hero, so the header is at bottom of screen initially
    function scrollToContent(event) {
      event.preventDefault();
      event.stopPropagation();

      console.log('🎯 Scrolling to main content');

      const heroHeight = heroSection.offsetHeight;
      window.scrollTo({
        top: heroHeight,
        behavior: 'smooth'
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    const clickTargets = document.querySelectorAll('.hero-video__wrapper, .hero-video__scroll-down');
    clickTargets.forEach(target => {
      target.addEventListener('click', scrollToContent);
      target.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          scrollToContent(event);
        }
      });
    });

    handleScroll();
    console.log('🚀 Hero Video Manager: Improved offset handling');
  }
})();