# MosPochin Site — Asset Map

> Все ресурсы загружаются локально из `/assets/`. Единственный внешний ресурс — Tailwind CSS CDN (JIT config).

## Directory Structure

```
/home/artikk/Mospochin_site/
├── assets/
│   ├── css/
│   │   ├── styles-built.css    # Tailwind CSS (built from input.css)
│   │   └── styles.css          # Custom CSS (animations, glass effects)
│   ├── js/
│   │   ├── main.js             # Components (header, footer, mobile menu, scroll, counters)
│   │   └── telegram-form.js    # Telegram form handler
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
│       └── computer-*.jpeg     # Computer images
├── bytovaya-index.html         # Главная (бытовая)
├── bytovaya-uslugi.html        # Услуги (бытовая)
├── bytovaya-about.html         # О нас (бытовая)
├── bytovaya-contact.html       # Контакты (бытовая)
├── index.html                  # Главная (ресторанное)
├── uslugi.html                 # Услуги (ресторанное)
├── about.html                  # О нас (ресторанное)
├── contact.html                # Контакты (ресторанное)
├── main.js                     # → symlink to /assets/js/main.js
├── telegram-form.js            # → symlink to /assets/js/telegram-form.js
├── styles-built.css            # → symlink to /assets/css/styles-built.css
├── styles.css                  # → symlink to /assets/css/styles.css
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
   - `main.js` → Header/footer injection, mobile menu, scroll animations, counters
   - `telegram-form.js` → Form submission to Telegram

## CDN Dependencies

| Resource | URL | Purpose |
|----------|-----|---------|
| Tailwind CSS | `https://cdn.tailwindcss.com` | JIT config for brand colors |

## Page Structure (LLM-readable)

Each page follows this template:

```
<head> → Meta, SEO, OG, Fonts, CSS, Tailwind Config, JS (defer), JSON-LD
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

## Build Commands

```bash
npm run build:css  # Build Tailwind CSS from input.css
npm run build      # Build CSS + merge custom styles
npm run dev        # Start HTTP server (port 3000)
```
