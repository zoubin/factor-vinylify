var factor = require('../..')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var gulp = require('gulp')
var gutil = require('gulp-util')
var log = gutil.log.bind(gutil)
var rename = require('gulp-rename')

module.exports = function (entries, bopts, dest, fopts, renameFn) {
  return browserify(entries, bopts)
    .plugin(factor, fopts)
    .bundle()
    .on('error', log)
    .pipe(uglify())
    .pipe(rename(renameFn || function (p) {
      return p
    }))
    .pipe(gulp.dest(dest))
}

