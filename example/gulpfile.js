var vinylify = require('..');
var browserify = require('browserify');

var path = require('path');
var del = require('del');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var gulp = require('gulp');

var fixtures = path.resolve.bind(path, __dirname);
var log = gutil.log.bind(gutil);
var DEST = fixtures('build');

gulp.task('clean', function () {
  return del(DEST);
});

gulp.task('single-bundle', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  };
  return browserify(opts)
    .plugin(vinylify, { common: 'common.js' })
    .bundle()
    .on('log', log)
    .on('error', log)
    .pipe(uglify())
    .pipe(gulp.dest(DEST));
});

gulp.task('multi-bundles-with-entry-in-common', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  };
  return browserify(opts)
    .plugin(vinylify, {
      entries: ['green.js', 'red.js'],
      outputs: ['green.js', 'red.js'],
      common: 'common.js',
    })
    .bundle()
    .on('log', log)
    .on('error', log)
    .pipe(uglify())
    .pipe(gulp.dest(DEST));
});

gulp.task('bundle-for-each-browserify-entry', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  };
  return browserify(opts)
    .plugin(vinylify, {
      needFactor: true,
      common: 'common.js',
    })
    .bundle()
    .on('log', log)
    .on('error', log)
    .pipe(uglify())
    .pipe(gulp.dest(DEST));
});

gulp.task('bundle-for-each-browserify-entry-with-no-common', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  };
  return browserify(opts)
    .plugin(vinylify, {
      needFactor: true,
    })
    .bundle()
    .on('log', log)
    .on('error', log)
    .pipe(uglify())
    .pipe(gulp.dest(DEST));
});

