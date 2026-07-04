# DEPLOY SEQUENCE V7

Use this package instead of V6 if the package is `NOFONTS`.
V7 preserves production font binaries during `rsync --delete`.

```bash
mkdir -p ~/mospochin_v7_deploy
cd ~/mospochin_v7_deploy
unzip mospochin_site_REBASED_V7_static_deploy_NOFONTS_2026-07-04.zip -d site
cd site

./_ops/predeploy_local_check_v6.sh .
./_ops/production_remote_preflight_v7.sh mospochin-site-vps /var/www/mospochin.ru
./_ops/safe_rsync_deploy_v7.sh . mospochin-site-vps /var/www/mospochin.ru

./_ops/postdeploy_smoke_v6.sh https://mospochin.ru
./_ops/postdeploy_event_smoke_v7.sh https://mospochin.ru
./_ops/artikk_smoke_tail_v7.sh artikk-local smoke_v7
./_ops/artikk_daily_run_check_v6.sh artikk-local
```

Rollback:

```bash
./_ops/rollback_v6.sh mospochin-site-vps /var/backups/mospochin/docroot_before_v7_YYYY-MM-DD_HHMMSS.tar.gz /var/www
```
