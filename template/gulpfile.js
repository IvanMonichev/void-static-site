const gulp = require("gulp");
const postcss = require("gulp-postcss");
const tailwindcss = require("@tailwindcss/postcss");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const htmlhint = require("gulp-htmlhint");
const { deleteSync } = require("del");

async function clean() {
  return deleteSync(["build"], {force: true});

}

function css() {
  return gulp
    .src("css/tailwind.css")
    .pipe(postcss([tailwindcss, autoprefixer()]))
    .pipe(rename("styles.css"))
    .pipe(gulp.dest("build/assets"));
}

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

// function copyToTheme() {
//   return gulp
//     .src("build/**/*", { base: "build" })
//     .pipe(gulp.dest("../void-theme"));
// }

const build = gulp.series(clean, css, templates);
function watch() {
  gulp.watch(["css/**/*.css", "html/**/*.html"], build);
}

exports.clean = clean;
exports.watch = watch;
exports.build = build
