# MosPochin Site — Asset Map

> Current pages load local CSS, images, and JavaScript; `styles.css` still imports Google Fonts. Use `npm run audit:assets` before pruning tracked assets.

## Directory Structure

```
<repository-root>/
├── assets/
│   ├── css/
│   │   ├── styles-built.css    # legacy built CSS copy; pages load the root file
│   │   └── styles.css          # legacy custom CSS copy; pages load the root file
│   ├── fonts/
│   │   ├── manrope.css         # Manrope font faces (400-800)
│   │   ├── remixicon.css       # RemixIcon icon font
│   │   ├── remixicon.woff2     # RemixIcon binary
│   │   ├── xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk*.ttf  # Manrope TTF files
│   │   └── XRXI3I6Li01BKofiOc5wtlZ2di8HD*.ttf   # Inter TTF files (legacy)
│   ├── icons/
│   │   └── sprite.svg          # SVG sprite (unused, icons via RemixIcon)
│   └── images/
│       ├── hero-05.jpg         # Hero image (washing machine)
│       ├── hero-bg-19.jpg      # Hero background
│       ├── hero-bg-a1.jpg      # Alternative hero bg
│       ├── hero-bg-a7.jpg      # Alternative hero bg
│       ├── fridge-*.jpg        # Refrigerator images
│       ├── dishwasher-*.jpg    # Dishwasher images
│       ├── microwave-*.jpeg    # Microwave images
│       ├── computer-*.jpeg     # Computer images
│       ├── ventilation-*.jpg   # Canonical ventilation photo sources
│       └── responsive/ventilation-*-*w.jpg(.webp) # Responsive production variants
├── bytovaya-index.html         # Главная (бытовая)
├── bytovaya-uslugi.html        # Услуги (бытовая)
├── bytovaya-about.html         # О нас (бытовая)
├── bytovaya-contact.html       # Контакты (бытовая)
├── index.html                  # Главная (ресторанное)
├── uslugi.html                 # Услуги (ресторанное)
├── about.html                  # О нас (ресторанное)
├── contact.html                # Контакты (ресторанное)
├── main.js                     # Canonical runtime JS
├── telegram-form.js            # Telegram form handler (canonical source)
├── styles-built.css            # built stylesheet loaded by pages
├── styles.css                  # hand-maintained stylesheet loaded by pages
├── og-image.svg                # Open Graph image
└── favicon.svg                 # Favicon
```

## Asset Loading Order

1. **Fonts** (preload → load)
   - `manrope.css` → Manrope wght 400, 500, 600, 700, 800
   - `remixicon.css` → Icon font (woff2)

2. **CSS** (preload → load)
   - `styles-built.css` → Tailwind utility classes
   - `styles.css` → Custom animations, glass effects

3. **JS** (defer)
   - `main.js` → Canonical runtime JS: header/footer injection, mobile menu, branch UI, scroll animations, counters
   - `telegram-form.js` → Form submission to Telegram

## Asset Audit

- `npm run audit:assets` is read-only.
- "Outside site reference graph" only means a tracked asset is not referenced by current HTML/CSS/JS/JSON; it remains a review candidate, not automatic deletion proof.
- Unused raster images may be parked locally under ignored `.asset-archive/unused-images/` before final deletion.
- `npm run check:image-budget` checks raster files included in the deploy manifest.
- Ventilation photo ownership and page intent are recorded in `data/ventilation-photo-map.json`; rendered galleries use `data-architecture-contract="ventilation-photo-map-v1"`.

## Page Structure (LLM-readable)

Each page follows this template:

```
<head> → Meta, SEO, OG, Fonts, CSS, JS (defer), JSON-LD
<body>
  #header-container → Injected by Components.getHeader()
  <header> → Hero section (varies per page)
  <section> → CTA bar
  <section> → Main content (varies per page)
  ...
  <section> → Contact form (telegram-form)
  Mobile sticky footer → CTA buttons
  #footer-container → Injected by Components.getFooter()
  telegram-form.js
</body>
```

## Components (main.js)

- `Components.getHeader()` → Dynamic header with branch detection (бытовая/ресторанное)
- `Components.getFooter()` → Dynamic footer with all page links
- `Components.initMobileMenu()` → Mobile hamburger menu
- `Components.initScrollEffect()` → Navbar shadow on scroll
- `Components.initFadeIn()` → IntersectionObserver for scroll-reveal
- `Components.initCounters()` → Animated number counters
- `Components.initHeadingReveal()` → Blur-in headings

## Asset Commands

```bash
npm run audit:assets       # Read-only asset inventory
npm run optimize:images    # Optimize changed raster assets
npm run check:image-budget # Check deploy-manifest raster budget
npm run dev        # Start HTTP server (port 3000)
```
