var factor = require('../..')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var gulp = require('gulp')
var gutil = require('gulp-util')
var log = gutil.log.bind(gutil)

module.exports = function (entries, bopts, dest, fopts) {
  return browserify(entries, bopts)
    .plugin(factor, fopts)
    .bundle()
    .on('error', log)
    .pipe(uglify())
    .pipe(gulp.dest(dest))
}

