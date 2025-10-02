# Задание 2

Учебный проект для демонстрации разработки и сборки кастомной темы для **MkDocs** с использованием **TailwindCSS** и пайплайнов GitHub Actions для деплоя на GitHub Pages.  

Репозиторий: [GitHub Repo](https://github.com/username/void-static-site)  

---

## 📦 Используемый стек
- **MkDocs** — генератор статических сайтов на основе Markdown.  
- **TailwindCSS** — утилитарный CSS-фреймворк.  
- **Gulp** — сборщик для автоматизации задач (CSS, HTML, минификация).  
- **GitHub Actions** — CI/CD для сборки и публикации на GitHub Pages.  

---

## ⚙️ Gulpfile.js

В проекте используется сборка фронтенда через Gulp.  

### Задачи GulPs:

- **clean** — очищает папку `build` перед каждой новой сборкой:  

```js
async function clean() {
  return deleteSync(["build"], { force: true });
}
```

- **css** — подключает TailwindCSS и Autoprefixer через PostCSS, собирает стили и кладёт в `build/assets/styles.css`:  

```js
function css() {
  return gulp
    .src("css/tailwind.css")
    .pipe(postcss([tailwindcss, autoprefixer()]))
    .pipe(rename("styles.css"))
    .pipe(gulp.dest("build/assets"));
}
```

- **templates** — проверяет HTML через `gulp-htmlhint`, минифицирует с помощью `gulp-htmlmin` и копирует в `build/`:  

```js
function templates() {
  return gulp
    .src("html/**/*.html")
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
      })
    )
    .pipe(gulp.dest("build"));
}
```

- **build** — основная задача: `gulp.series(clean, css, templates)`  
- **watch** — отслеживает изменения в CSS/HTML и пересобирает проект.  

---

## 📐 TailwindCSS

Подключение Tailwind происходит через PostCSS:  

- Входной файл `css/tailwind.css` содержит директивы:  

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- В `gulpfile.js` подключён Tailwind и Autoprefixer:  

```js
const postcss = require("gulp-postcss");
const tailwindcss = require("@tailwindcss/postcss");
const autoprefixer = require("autoprefixer");
```

Tailwind сканирует HTML-файлы и генерирует только используемые классы.  

---

## 🚀 CI/CD (GitHub Actions)

Файл `.github/workflows/deploy.yml` содержит пайплайн, разделённый на три джоба:  

1. **frontend** — установка Node.js и сборка темы через Gulp.  
2. **mkdocs** — установка Python, зависимостей из `requirements.txt`, сборка сайта MkDocs.  
3. **deploy** — публикация содержимого `site/` в ветку `gh-pages` для GitHub Pages.  

### Пример пайплайна

```yaml
name: Build & Deploy MkDocs site to Pages

on:
  push:
    branches: ["main"]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Node.js deps
        run: npm ci
        working-directory: template

      - name: Build frontend with Gulp
        run: npx gulp build
        working-directory: template

      - name: Upload theme artifact
        uses: actions/upload-artifact@v4
        with:
          name: void-theme
          path: void-theme

  mkdocs:
    runs-on: ubuntu-latest
    needs: frontend
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Download theme artifact
        uses: actions/download-artifact@v4
        with:
          name: void-theme
          path: void-theme

      - name: Install Python deps
        run: pip install -r requirements.txt

      - name: Build MkDocs site
        run: mkdocs build --strict

      - name: Upload site artifact
        uses: actions/upload-artifact@v4
        with:
          name: site
          path: site

  deploy:
    runs-on: ubuntu-latest
    needs: mkdocs
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Download site artifact
        uses: actions/download-artifact@v4
        with:
          name: site
          path: site

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site
```

---

## 🔑 Этапы пайплайна

1. **Frontend build**  
   - Gulp собирает CSS (Tailwind + Autoprefixer) и минифицирует HTML.  
   - Результат: папка `void-theme/`.  

2. **MkDocs build**  
   - Установка зависимостей из `requirements.txt`.  
   - MkDocs использует кастомную тему `custom_dir: void-theme`.  
   - Результат: папка `site/`.  

3. **Deploy**  
   - Содержимое `site/` деплоится в ветку `gh-pages`.  
   - GitHub Pages раздаёт сайт.  

---

## ✅ Вывод

- Для сборки фронтенда используется **Gulp** (минификация HTML, подключение TailwindCSS через PostCSS).  
- Для генерации сайта используется **MkDocs** с кастомной темой.  
- CI/CD реализован через **GitHub Actions** (3 этапа: frontend → mkdocs → deploy).  
- Готовый сайт автоматически публикуется на **GitHub Pages**.  
