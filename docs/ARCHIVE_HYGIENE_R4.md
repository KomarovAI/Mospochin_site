# Archive Hygiene R4 — MosPochin

**Дата:** 17 июля 2026 года

## Статус

- Текущий опубликованный scope проекта считается завершённым.
- 12 Sous-vide P2 страниц зафиксированы как deferred research backlog, а не как незавершённая публикация.
- Удалены только файлы, которые maintenance-аудиты не находили в text/import/npm/deploy graph.
- Responsive images и WebP sidecars синхронизированы штатными генераторами.
- Sous-vide Run 5 guard ограничен editorial-областью между static shell и footer; глобальные header/footer ссылки проверяются shell/crawl guards.
- `.github/workflows/**` оформлен как optional danger zone: lightweight ZIP не управляет каноническим GitHub deploy workflow.
- Parametric lead-form parser извлекает текст submit-кнопки независимо от переносов строки и вложенной иконки.

## Удалённые historical/orphan файлы

Содержимое не переносилось в active documentation, потому что оно не участвовало в текущих contracts. Для аудита сохранены имена, размеры и SHA-256.

| Файл | Размер | SHA-256 |
|---|---:|---|
| `docs/ARCHIVE_HYGIENE.md` | 1860 | `c6082a1616d6a65425b95cb75f08adf97815a9ffc0f92678b2aad9931816d1bb` |
| `docs/DISHWASHER_EVIDENCE_GUIDE.md` | 1110 | `5f56b8920d01e5932a07bfa60c75883b2914bd9a42c73b118a47f43518e13a38` |
| `docs/DISHWASHER_SEO_LINKING_GUIDE.md` | 2068 | `c5eb32c568fa6e3d0467def6ab82c53c3321bb7066512994389b28cd19f0b78d` |
| `docs/K9_PREDEPLOY_GATE.md` | 2005 | `98b0b79eb42fae9b7ce1069023c52ef95108adf74926fb9df08190b1d3c869bd` |
| `docs/LIVE_VISUAL_PACK_MVP.md` | 924 | `b0624e52394e058457944a3f15dfcedf48111fea176e423124d58a83e79e22bd` |
| `docs/LOCAL_VISUAL_SCREENSHOT_PACK.md` | 834 | `ce5aaaaf7338fde6738598df1b4558fc6cafba3d7806ad69d9b74dff8a4af251` |
| `docs/PAGE_IMPROVEMENT_METRICS.md` | 4028 | `87dad68909f33bfea91ea918671ac9318fc2a2dd7ffb672332eca17aa4200351` |
| `docs/TECHNICAL_OPTIMIZATION_20260714.md` | 2336 | `f48d436c837436ad24bb068f04e6a18ed8ee8713cde303521c40e672572109fb` |
| `docs/cooking-kettles-run4-handoff-20260618.md` | 3060 | `68b54990ae629f5ddd4c8b2aa70453db5d4f2a7f48151ab0f1b8d64619769e5c` |
| `docs/mospochin-deploy-handoff-run8-20260621.md` | 6153 | `7223e4c617ca1783796dd5dccbcb32acbd104350b4cd1d3dae50d096ae0bf418` |
| `main_js_followup_visual.diff` | 2334 | `e4c83c6dfcdc0e8c60e12b3bceabcf1410bc884bf5e0e174e30a80e95d78ad67` |
| `main_js_visual_patch.diff` | 1506 | `698c99c033963f089a574904a7dd2cb5c3fe562b130888d8296b366c9da7f695` |
| `partials-injector.js` | 2232 | `7a5f654912ba96846fd00309333b51825b61da11119929446ff67554f75768cf` |
| `partials/countdown-timer.html` | 1579 | `427143d33892e4ae6580556cd52624d3be825510c3f34960adbfe36ea3c52662` |
| `partials/mobile-footer.html` | 1030 | `e876459f3142ba90e597db270f49fcacae86f9933c4aebbbd50aaff9c3a26303` |
| `partials/noscript-fallback.html` | 1007 | `93c1594470e366f9ad70cd4a27401430903b4efd453334f75fec85a3a1d92e6e` |
| `partials/whatsapp-float.html` | 538 | `a76de564ee52dcc4c77fc6e4afa053f9c5a39662fde2b73d9cfdde4afddf1af9` |
| `styles_floating_cta_patch.diff` | 972 | `03367920f83dd423b5c6cb2f3cee89d6de9cd8a5ad42f6d2e6902870d37e4ca6` |
| `styles_visual_patch.diff` | 3637 | `39672e990f590545269c0434541fdebd232b08575a97ec2a13fe666ecffd570f` |
| `tools/capture-refrigeration-rf3-review-fast.mjs` | 1733 | `c529c573dec36ea1c1eeee04df6049b560ef5075c552aeb81d6c3c6cbe0bff9e` |
| `tools/capture-refrigeration-rf4-review-fast.mjs` | 2040 | `f647ff95c4208be912cd3a00b073412d345f15430402ef0eef8d32f6012d99ab` |
| `tools/capture-refrigeration-rf4-review-resume.mjs` | 2246 | `16e312725baab94758e2c36f79b8246672b9a72852dc0df596a89c6cc9cfcd51` |
| `tools/capture-refrigeration-rf5-review-fast.mjs` | 2035 | `6018bcd4852b8ce642bcac958e28362cd117423904fcf8f2d860db75214f2a30` |
| `tools/capture-refrigeration-rf5-review-resume.mjs` | 1632 | `99c9c729038eeaaebd9bbf332be38123a47dcc394ddc94747434962d6460dd3c` |
| `tools/capture-refrigeration-rf7-review-fast.mjs` | 2461 | `7fb0b86895e21c559292b4b21be6220279111e7544735b7fb68efe6083a0655d` |
| `tools/capture-restaurant-shell-v2-review.mjs` | 2155 | `3a8a36615adeb6ea916a53598488cb0efc9a5f9427b75b886c665552c7c50a9e` |
| `tools/check-ai-visual-review.mjs` | 2547 | `aa234f27959ea19f9146c74921e0689c97934827db51e70b2bd484ee92283177` |
| `tools/check-deploy-runtime.mjs` | 3789 | `42456309f6f56b4100731764c9eb429dedd7ce512e31c185a839be12f5de447f` |
| `tools/check-visible-copy.mjs` | 11378 | `f8f2ff5eeffd77d13d8c6749445bb429d214c54b82046b3e095be8d309306ada` |
| `tools/create-ai-visual-review-pack.mjs` | 7656 | `f4023dd0efb1e09de035a60edc5d5d33596beccb9536c39f929891341f4f8047` |
| `tools/generate-dishwasher-dw2.mjs` | 57916 | `483d84f03522163060779124f39e6b50effc24397dd9940da58e317573096ae3` |
| `tools/screenshot-live-site.mjs` | 14437 | `9d2e83c38d4e538b11ed8c26481abfe7135de3794a22a11fbbcbe40b0e5fd235` |
| `tools/smoke-production-conversion.mjs` | 5216 | `e631848179880987fbe08c687efd04b4d4b4bde145494077eca64f8d092aed95` |
| `tools/sync-paid-tracking-v3-source.mjs` | 2459 | `bce43f921f24ec6b75dc9d3bd17dd7d3c4cb1a12885d421ba3abdb920f201a0c` |
| `tools/sync-refrigeration-rf8-source.mjs` | 1520 | `1ea731e7274be4abc86afce8c4a56181da3c4ee62a7e90048fd0db6ae7a2b79b` |
| `tools/sync-refrigeration-rf9-source.mjs` | 1444 | `9f0901a24903c236cf7693a031a776ea84295941b5077b979d22d5c8aca97d5f` |
| `tools/validate-site-v11-static-wrapper.mjs` | 2617 | `7584636041b99094af445db066404485c223835bbfd0ae5e189b46382635b012` |
| `tools/validate-site.strict.mjs` | 2906 | `74ab5e50ab3f7ffec56e890eb083615e304f2d4a0a098cae92473f430536ec1a` |
| `tools/visual-atomic-capture.mjs` | 23274 | `00768ec3ba6f2c24c648df6b5f82f57a7b84ad2c752c205844d1117775419919` |
| `tools/visual-audit-capture.mjs` | 7168 | `a75a5e386d1793de5d485e9792f62c7cebe1d7a2054bb74153c8185fd12fcb5f` |
| `tools/visual-audit-merge.mjs` | 3655 | `e00efb3900455af5224c8f8a4629987d2e62faa05342d204f8bb46bd56bbadd2` |
| `tools/visual-audit-plan.mjs` | 4148 | `5ac3de4a75fc05c33a78a8c0ee3b7d704b78bdc15eb415108b577578abc99c10` |
| `tools/visual-contact-sheets.mjs` | 15056 | `01557596468fe396afea1d115937c2c862dc6ed8799999771a1407f7420ad91e` |
| `tools/visual-dom-dissector.mjs` | 19605 | `172cc9ebd95c06fec27ecc21000eb89b9f2fd6fb45f494072858876232d65f43` |
| `tools/visual-shard-merge.mjs` | 4145 | `bcb684e6fafa419f07b089aced85a19db13f84b9779a98c87029a341939f6d48` |
| `tools/visual-shard-plan.mjs` | 4098 | `59f28dff9f93632357f1abc66a2676b959a6c573c466e5170977afd1756ba50a` |
| `tools/visual-shard-runner.mjs` | 17017 | `3ff40e99eb5710f4f1836a32a215f2973b72efe4558ee579b73518175e5dcf27` |
| `tools/visual-targeted-mobile-deep.mjs` | 9611 | `232d06484af23889c7a6e9a36091197c0050ac1941fc633e8499a88f6d38d4d6` |

| `tools/visual-capture-plan.mjs` | 10234 | `936536694479c92d8d5fff9d7992fb425928644981e8449c0c63d8dd26840902` |

| `action` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `landing-` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `main` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `mospochin-site@1.0.0` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `node` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

## Active backlog

- `data/sous-vide-p2-backlog.json` — 12 deferred P2 research entries.
- Backlog pages remain absent from root HTML and sitemap.

## Guard

```bash
npm run check:archive-hygiene-r4
npm run check:images
npm run audit:maintenance
```
