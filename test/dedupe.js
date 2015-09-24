var factor = require('..');
var browserify = require('browserify');
var test = require('tap').test;
var runSequence = require('callback-sequence').run;
var path = require('path');
var del = require('del');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var equal = require('util-equal');

var fixtures = path.resolve.bind(path, __dirname);
var log = gutil.log.bind(gutil);
function dest(file) {
  if (file) {
    return fixtures('build', 'dedupe', file);
  }
  return fixtures('build', 'dedupe');
}
function expect(file) {
  if (file) {
    return fixtures('expected', 'dedupe', file);
  }
  return fixtures('expected', 'dedupe');
}

test('dedupe, dedupes should go to common', function(t) {
  t.plan(1);
  runSequence(
    [clean, bundle],
    function () {
      equal(
        ['common.js', 'blue-green.js', 'blue-red.js'].map(dest),
        ['common.js', 'blue-green.js', 'blue-red.js'].map(expect),
        function (res) {
          t.ok(res);
        }
      );
    }
  );
});

function clean() {
  return del(dest());
}

function bundle() {
  var opts = {
    basedir: fixtures('src', 'dedupe'),
  };
  return browserify(['blue-green.js', 'blue-red.js'], opts)
    .plugin(factor, {
      entries: ['blue-green.js', 'blue-red.js'],
      outputs: ['blue-green.js', 'blue-red.js'],
      common: 'common.js',
    })
    .bundle()
    .on('log', log)
    .on('error', log)
    .pipe(uglify())
    .pipe(gulp.dest(dest()));
}

