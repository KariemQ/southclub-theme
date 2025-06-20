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

    // Subtract the header height to make the sticky effect happen a bit earlier
    function getTriggerPoint() {
      const heroHeight = heroSection.offsetHeight;
      const headerHeight = headerGroup.offsetHeight;

      // Adjust the offset value here to tweak early vs late triggering
      const offset = 0; // or any small positive/negative number
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
    console.log('🚀 Hero Video Manager: Updated sticky trigger');
  }
})();