# MosPochin — floating CTA overlap visual fix

Дата: 2026-06-20
Scope: mobile-only visual polish after targeted mobile audit.

## Problem

On `/pishevarochnye-kotly.html` mobile, the green floating WhatsApp bubble could visually overlap the orange hero CTA `Позвонить инженеру` in the first viewport.

The page already has:

- hero phone CTA;
- hero WhatsApp/photo CTA;
- bottom sticky mobile phone/request bar.

The extra floating WhatsApp bubble is redundant on this page and creates visual CTA-on-CTA noise.

## Change

File changed:

- `styles-combined.css`

Added mobile-only CSS:

```css
@media (max-width: 767px) {
  body.page-pishevarochnye-kotly .fixed.bottom-24.right-4.z-50.md\:hidden {
    display: none !important;
  }
}
```

## Expected visual result

- `/pishevarochnye-kotly.html` mobile first viewport: no green floating bubble over hero CTA.
- Bottom sticky phone/request bar remains visible.
- Hero CTAs remain visible.
- Desktop unaffected.
- Other pages unaffected.

## Suggested checks

```bash
node --check main.js
npm run check:core
npm run verify:metrics

gh workflow run visual-audit.yml \
  -R KomarovAI/Mospochin_site \
  --ref main \
  -f scope=page \
  -f page="/pishevarochnye-kotly.html" \
  -f viewports=mobile \
  -f workers=1
```
