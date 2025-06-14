// Create a new file: assets/sticky-announcement.js

class StickyAnnouncement {
  constructor() {
    this.announcement = null;
    this.placeholder = null;
    this.isSticky = false;
    this.init();
  }

  init() {
    // Wait for DOM and Shopify theme to fully load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      setTimeout(() => this.setup(), 100);
    }
  }

  setup() {
    // Find the announcement bar
    this.announcement = document.querySelector('.announcement-bar');
    if (!this.announcement) {
      console.log('Announcement bar not found');
      return;
    }

    // Get the announcement section container
    this.announcementSection = this.announcement.closest('.shopify-section');
    if (!this.announcementSection) {
      console.log('Announcement section not found');
      return;
    }

    // Create a placeholder to prevent layout shift
    this.createPlaceholder();

    // Set up scroll listener
    this.setupScrollListener();

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  createPlaceholder() {
    this.placeholder = document.createElement('div');
    this.placeholder.style.display = 'none';
    this.announcementSection.parentNode.insertBefore(this.placeholder, this.announcementSection.nextSibling);
  }

  setupScrollListener() {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateSticky();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial state
    this.updateSticky();
  }

  updateSticky() {
    const scrollY = window.scrollY;
    const announcementTop = this.announcementSection.offsetTop;

    if (scrollY > announcementTop && !this.isSticky) {
      this.makeSticky();
    } else if (scrollY <= announcementTop && this.isSticky) {
      this.removeSticky();
    }
  }

  makeSticky() {
    this.isSticky = true;
    
    // Get current dimensions
    const rect = this.announcement.getBoundingClientRect();
    const height = this.announcement.offsetHeight;
    
    // Set placeholder height to prevent jump
    this.placeholder.style.height = height + 'px';
    this.placeholder.style.display = 'block';
    
    // Make the section sticky
    this.announcementSection.style.position = 'fixed';
    this.announcementSection.style.top = '0';
    this.announcementSection.style.left = '0';
    this.announcementSection.style.right = '0';
    this.announcementSection.style.width = '100%';
    this.announcementSection.style.zIndex = '9999';
    
    // Add a class for CSS targeting
    this.announcementSection.classList.add('is-sticky');
    
    // Adjust header position
    this.adjustHeader(height);
  }

  removeSticky() {
    this.isSticky = false;
    
    // Remove fixed positioning
    this.announcementSection.style.position = '';
    this.announcementSection.style.top = '';
    this.announcementSection.style.left = '';
    this.announcementSection.style.right = '';
    this.announcementSection.style.width = '';
    this.announcementSection.style.zIndex = '';
    
    // Hide placeholder
    this.placeholder.style.display = 'none';
    
    // Remove sticky class
    this.announcementSection.classList.remove('is-sticky');
    
    // Reset header position
    this.resetHeader();
  }

  handleResize() {
    if (this.isSticky) {
      // Update placeholder height
      const height = this.announcement.offsetHeight;
      this.placeholder.style.height = height + 'px';
      
      // Update header position
      this.adjustHeader(height);
    }
  }
  
  adjustHeader(announcementHeight) {
    // Find the header component
    const headerComponent = document.querySelector('header-component');
    const headerSection = document.querySelector('.header-section');
    
    if (headerComponent) {
      // Check if header has sticky behavior
      const stickyAttr = headerComponent.getAttribute('sticky');
      
      if (stickyAttr === 'always') {
        // Adjust the header's top position when it becomes sticky
        headerComponent.style.setProperty('--announcement-height', `${announcementHeight}px`);
        
        // Apply top offset to sticky header
        const headerRow = headerComponent.querySelector('.header__row');
        if (headerRow) {
          headerRow.style.top = `${announcementHeight}px`;
        }
      }
    }
    
    // Also adjust the header section if it exists
    if (headerSection) {
      headerSection.style.marginTop = `${announcementHeight}px`;
    }
  }
  
  resetHeader() {
    const headerComponent = document.querySelector('header-component');
    const headerSection = document.querySelector('.header-section');
    
    if (headerComponent) {
      headerComponent.style.removeProperty('--announcement-height');
      
      const headerRow = headerComponent.querySelector('.header__row');
      if (headerRow) {
        headerRow.style.top = '';
      }
    }
    
    if (headerSection) {
      headerSection.style.marginTop = '';
    }
  }
}

// Initialize
new StickyAnnouncement();