# Component Digest — deploySecurity

- Name: Deploy / security headers / compression
- Appears in: 0 pages
- Keywords: deploy, деплой, nginx, headers, csp, brotli, gzip, безопасност

## Related files

- deploy/post-activate.sh
- .deploy/include-files.txt
- .github/workflows/deploy.yml

## Risks

- High-risk зона: может сломать публикацию, сжатие, заголовки или rollback.

## Safe editing notes

- Всегда bash -n для shell и ручной review workflow/deploy.
