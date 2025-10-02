// Animations JavaScript
// Universal script for fade-in and slide-up animations

document.addEventListener('DOMContentLoaded', function() {
  // Smooth reveal animations
  const animated = document.querySelectorAll('.fade-in, .slide-up');
  
  if (animated.length > 0) {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
        }
      });
    }, { threshold: 0.2 });
    
    animated.forEach((el) => reveal.observe(el));
  }
});
