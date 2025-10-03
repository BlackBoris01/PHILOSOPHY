// Gallery JavaScript
// Tab switching functionality for photo galleries

document.addEventListener('DOMContentLoaded', function() {
  // Gallery tabs functionality
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  const galleries = document.querySelectorAll('.gallery');
  
  if (galleryTabs.length > 0 && galleries.length > 0) {
    galleryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetGallery = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs and galleries
        galleryTabs.forEach(t => t.classList.remove('active'));
        galleries.forEach(g => g.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding gallery
        tab.classList.add('active');
        const gallery = document.querySelector(`[data-gallery="${targetGallery}"]`);
        if (gallery) {
          gallery.classList.add('active');
        }
      });
    });
  }
});


