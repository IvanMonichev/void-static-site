const gulp = require("gulp");
const postcss = require("gulp-postcss");
const tailwindcss = require("@tailwindcss/postcss");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");

function css() {
  return gulp
    .src("css/tailwind.css")
    .pipe(postcss([tailwindcss, autoprefixer()]))
    .pipe(rename("styles.css"))
    .pipe(gulp.dest("build/assets"));
}

// Копирование шаблонов (overrides → build)
function templates() {
  return gulp
    .src("html/**/*.html")
    .pipe(gulp.dest("build"));
}

function copyToTheme() {
  return gulp
    .src("build/**/*", { base: "build" })
    .pipe(gulp.dest("../void-theme"));
}

const build = gulp.series(css, templates, copyToTheme);
// Вотчер: следим за CSS, md и html
function watch() {
  gulp.watch(["css/**/*.css", "html/**/*.html"], build);
}

exports.watch = watch;
exports.build = build
