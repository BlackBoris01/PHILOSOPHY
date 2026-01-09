// Home Page Navigation JavaScript
// Active navigation links based on scroll position

document.addEventListener('DOMContentLoaded', function() {
  // Active navigation link on scroll (only for home page with sections)
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav__link');
  
  if (sections.length > 0 && links.length > 0) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`.nav__link[href="#${id}"]`);
        if (link) {
          if (entry.isIntersecting) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        }
      });
    }, { rootMargin: '-50% 0px -40% 0px', threshold: 0.01 });
    
    sections.forEach((s) => io.observe(s));
  }
});


