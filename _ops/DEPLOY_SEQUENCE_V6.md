# MosPochin V6 deploy sequence

## 0. Which ZIP
Use `mospochin_site_REBASED_V6_static_deploy_NOFONTS_2026-07-04.zip` for static production deploy.
This package intentionally does **not** include binary fonts. It includes `assets/fonts/*.css` and `_ops/font_requirements_NOFONTS.*`; the remote preflight checks that the referenced font binaries already exist on production.

## 1. Local unpack and check

```bash
mkdir -p ~/mospochin_v6_deploy
cd ~/mospochin_v6_deploy
unzip mospochin_site_REBASED_V6_static_deploy_NOFONTS_2026-07-04.zip -d site
cd site
./_ops/predeploy_local_check_v6.sh .
```

## 2. Remote preflight

```bash
./_ops/production_remote_preflight_v6.sh mospochin-site-vps /var/www/mospochin.ru
```

## 3. Safe deploy with backup and dry-run

```bash
./_ops/safe_rsync_deploy_v6.sh . mospochin-site-vps /var/www/mospochin.ru
```

The script performs local check, remote font preflight, remote tar backup, `rsync --dry-run`, manual `DEPLOY` confirmation, rsync apply, nginx config test and reload.

## 4. Post-deploy smoke

```bash
./_ops/postdeploy_smoke_v6.sh https://mospochin.ru
./_ops/artikk_daily_run_check_v6.sh artikk-local
```

## 5. Log PASS criteria

The next useful log must show at least one of: `form_submit_click`, `form_validation_error`, `form_submit_attempt`, `form_submit_success`.

If there is still `form_start` but none of these events, the user is abandoning before pressing submit.

## 6. Rollback

Use the backup path printed by safe deploy:

```bash
./_ops/rollback_v6.sh mospochin-site-vps /var/backups/mospochin/docroot_before_v6_YYYY-MM-DD_HHMMSS.tar.gz /var/www
```
