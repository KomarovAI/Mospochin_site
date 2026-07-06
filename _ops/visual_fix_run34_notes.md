# V11.1 Run34 — Global mobile H1 hardening

Добавлен второй CSS-слой поверх Run33: убран остаточный `overflow-wrap:anywhere` на mobile H1 для старых hub/info страниц (`uslugi.html`, `contact.html`) без изменения HTML, URL, canonical, sitemap и JS.

Цель: чтобы все проверяемые mobile H1 после browser smoke имели `overflow-wrap: normal` и `word-break: normal`.
