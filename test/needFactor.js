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
var dest = fixtures.bind(null, 'build', 'needFactor');
var expect = fixtures.bind(null, 'expected', 'needFactor');

test('multiple bundles', function(t) {
  t.plan(1);
  runSequence(
    [clean, bundle],
    function () {
      equal(
        [dest('common.js'), dest('green.js'), dest('red.js')],
        [expect('common.js'), expect('green.js'), expect('red.js')],
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
    basedir: fixtures('src', 'needFactor'),
  };
  return browserify(['green.js', 'red.js'], opts)
    .plugin(factor, {
      common: 'common.js',
      needFactor: true,
    })
    .bundle()
    .on('log', log)
    .on('error', log)
    .pipe(uglify())
    .pipe(gulp.dest(dest()));
}

