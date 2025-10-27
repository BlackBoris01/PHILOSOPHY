// Mobile Menu JavaScript
// Universal script for all pages

document.addEventListener('DOMContentLoaded', function() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');
  
  if (!mobileToggle || !nav) return; // Exit if elements don't exist
  
  // Function to open menu
  function openMenu() {
    nav.classList.add('nav--open');
    mobileToggle.classList.add('mobile-menu-toggle--active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
  
  // Function to close menu
  function closeMenu() {
    nav.classList.remove('nav--open');
    mobileToggle.classList.remove('mobile-menu-toggle--active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Toggle mobile menu
  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (nav.classList.contains('nav--open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking on nav link
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside nav (if needed)
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('nav--open') && 
        !nav.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
      closeMenu();
    }
  });
});
