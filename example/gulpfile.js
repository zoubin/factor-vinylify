var vinylify = require('..')
var browserify = require('browserify')

var path = require('path')
var del = require('del')
var gutil = require('gulp-util')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var gulp = require('gulp')

var fixtures = path.resolve.bind(path, __dirname)
var log = gutil.log.bind(gutil)
var DEST = fixtures('build')

gulp.task('clean', function () {
  return del(DEST)
})

gulp.task('single-bundle', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  }
  return browserify(opts)
    .plugin(vinylify, { common: 'common.js' })
    .on('log', log)
    .on('error', log)
    .bundle()
    .pipe(uglify())
    .pipe(gulp.dest(DEST))
})

gulp.task('multi-bundles-with-entry-in-common', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  }
  return browserify(opts)
    .plugin(vinylify, {
      entries: ['green.js', 'red.js'],
      common: 'common.js',
    })
    .on('log', log)
    .on('error', log)
    .bundle()
    .pipe(uglify())
    .pipe(gulp.dest(DEST))
})

gulp.task('bundle-for-each-browserify-entry', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  }
  return browserify(opts)
    .plugin(vinylify, {
      needFactor: true,
      common: 'common.js',
    })
    .on('log', log)
    .on('error', log)
    .bundle()
    .pipe(uglify())
    .pipe(gulp.dest(DEST))
})

gulp.task('bundle-for-each-browserify-entry-with-no-common', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  }
  return browserify(opts)
    .plugin(vinylify, {
      needFactor: true,
    })
    .on('log', log)
    .on('error', log)
    .bundle()
    .pipe(uglify())
    .pipe(gulp.dest(DEST))
})

gulp.task('outputs', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  }
  return browserify(opts)
    .plugin(vinylify, {
      outputs: ['page/blue.js', 'page/green.js', 'page/red.js'],
      common: 'common.js'
    })
    .on('log', log)
    .on('error', log)
    .bundle()
    .pipe(uglify())
    .pipe(gulp.dest(DEST))
})

gulp.task('rename', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  }
  return browserify(opts)
    .plugin(vinylify, {
      needFactor: true,
      common: 'common.js'
    })
    .on('log', log)
    .on('error', log)
    .bundle()
    .pipe(rename(function (p) {
      if (p.basename === 'common') {
        return p
      }
      p.dirname += '/page'
      return p
    }))
    .pipe(uglify())
    .pipe(gulp.dest(DEST))
})

