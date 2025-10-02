# CSS Structure

## Quick Reference

```
css/
├── base.css                    # Base styles (always load first)
├── main.css                    # All imports (optional)
└── pages/                      # Page-specific styles
    ├── home/home.css          # Homepage
    ├── about/about.css        # About page
    ├── exhibitions/exhibitions.css # Exhibitions
    ├── events/events.css      # Events
    ├── contacts/contacts.css  # Contacts
    └── news/news.css          # News articles
```

## Usage

Each page loads only what it needs:

```html
<!-- Homepage -->
<link rel="stylesheet" href="css/base.css" />
<link rel="stylesheet" href="css/pages/home/home.css" />

<!-- About page -->
<link rel="stylesheet" href="css/base.css" />
<link rel="stylesheet" href="css/pages/about/about.css" />
```

## Adding New Pages

1. Create folder: `css/pages/new-page/`
2. Create file: `css/pages/new-page/new-page.css`
3. Link in HTML: `<link rel="stylesheet" href="css/pages/new-page/new-page.css" />`

See `CSS-STRUCTURE.md` for detailed documentation.
