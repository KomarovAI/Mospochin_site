# Archive hygiene for MosPochin

Полный project ZIP и public deploy ZIP — это разные артефакты.

## Правило

Полный project ZIP должен содержать source/work layer проекта, но не должен тащить внутрь уже собранные deploy ZIP, browser screenshots, heavy logs и временные артефакты.

Public deploy ZIP создаётся отдельно командой:

```bash
npm run deploy:pack
```

Полный source/handoff archive создаётся отдельно командой:

```bash
npm run archive:project
```

## Что исключается из полного project ZIP

Главные исключения из `.project-archiveignore`:

```text
.deploy/dist/
.artifacts/
.archives/
reports/visual-ai-review/
node_modules/
.git/
*.zip
*.log
```

Это защищает от ситуации, когда public deploy ZIP попадает внутрь полного project ZIP и каждый следующий прогон раздувает архив.

## Проверка размера

Перед передачей архива:

```bash
npm run check:archive-hygiene
npm run archive:project
```

Если нужен public ZIP:

```bash
npm run deploy:pack
```

После этого отдавать два отдельных файла:

```text
mospochin-site-project-*.zip        # source/project archive
mospochin-public-deploy-*.zip       # public deploy pack
```

Не вкладывать один ZIP внутрь другого.
