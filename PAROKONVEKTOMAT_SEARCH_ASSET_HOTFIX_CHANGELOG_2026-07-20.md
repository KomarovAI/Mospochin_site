# Parokonvektomat search runtime asset hotfix

- Added root runtime asset `/error-search-data.js` with 102 normalized records.
- `error-search.js` uses the root JS payload first and nested JSON only as fallback.
- `parokonvektomaty-kody-oshibok.html` loads the data asset before the search module.
- The exact browser URL is included in deploy manifest and production smoke.
