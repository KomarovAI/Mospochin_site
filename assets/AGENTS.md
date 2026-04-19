# Assets Rules

- Edit source assets first: `assets/css/styles.css`, images, icons, fonts.
- Treat `assets/css/styles-built.css` as generated unless the task explicitly targets the built file.
- Keep asset names, paths, and paired original/optimized variants consistent.
- Do not rename or move shared assets casually; pages may reference them directly.
- After relevant changes, run `npm run validate:site` and any matching repo-level regeneration command.
