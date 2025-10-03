# JavaScript Files Structure

## Overview

JavaScript functionality is organized into modular files for better maintainability and performance.

## Files

### Core Scripts (Used on all pages)

- **`mobile-menu.js`** - Mobile hamburger menu functionality
  - Toggle menu on/off
  - Close menu on link click
  - Close menu on overlay click
  - Close menu with Escape key
  - Accessibility features

- **`animations.js`** - Scroll-based animations
  - Fade-in animations
  - Slide-up animations
  - Intersection Observer implementation

### Page-Specific Scripts

- **`home-navigation.js`** - Homepage navigation (index.html only)
  - Active navigation links based on scroll position
  - Section highlighting

- **`gallery.js`** - Photo gallery functionality (exhibitions.html)
  - Tab switching for photo galleries
  - Active gallery management

- **`events-filter.js`** - Events filtering (events.html)
  - Filter events by category
  - Dynamic show/hide functionality

## Usage in HTML

### Standard Pages (About, Contacts, News)
```html
<!-- JavaScript Files -->
<script src="js/mobile-menu.js"></script>
<script src="js/animations.js"></script>
```

### Homepage (index.html)
```html
<!-- JavaScript Files -->
<script src="js/mobile-menu.js"></script>
<script src="js/home-navigation.js"></script>
<script src="js/animations.js"></script>
```

### Exhibitions Page
```html
<!-- JavaScript Files -->
<script src="js/mobile-menu.js"></script>
<script src="js/gallery.js"></script>
<script src="js/animations.js"></script>
```

### Events Page
```html
<!-- JavaScript Files -->
<script src="js/mobile-menu.js"></script>
<script src="js/events-filter.js"></script>
<script src="js/animations.js"></script>
```

## Benefits

1. **Modularity** - Each script has a single responsibility
2. **Performance** - Pages load only needed JavaScript
3. **Maintainability** - Easy to update specific functionality
4. **Reusability** - Core scripts used across multiple pages
5. **Loading** - All scripts use `DOMContentLoaded` for proper initialization

## Adding New Functionality

1. Create a new `.js` file in the `js/` directory
2. Wrap code in `DOMContentLoaded` event listener
3. Include the script in relevant HTML pages
4. Update this README with the new file information


