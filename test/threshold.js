var test = require('tape')
var runSequence = require('callback-sequence').run
var path = require('path')
var del = require('del')
var fixtures = path.resolve.bind(path, __dirname, 'fixtures')
var compare = require('./util/compare-directory')
var bundle = require('./util/bundle')
var dest = fixtures('build')
var src = fixtures('src', 'threshold')
var expected = fixtures('expected', 'threshold')

function clean() {
  return del(dest)
}

test('threshold, number', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['dark-blue.js', 'dark-green.js', 'red.js'],
        { basedir: src },
        dest,
        {
          needFactor: true,
          threshold: 2,
          common: 'common.js',
        }
      )
    },
    function () {
      compare(dest, expected, t)
    },
  ], cb)
})

test('threshold, string', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['dark-blue.js', 'dark-green.js', 'red.js'],
        { basedir: src },
        dest,
        {
          needFactor: true,
          threshold: '**/node_modules/**/*.js',
          common: 'common.js',
        }
      )
    },
    function () {
      compare(dest, expected, t)
    },
  ], cb)
})

test('threshold, regexp', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['dark-blue.js', 'dark-green.js', 'red.js'],
        { basedir: src },
        dest,
        {
          needFactor: true,
          threshold: /\/node_modules\//,
          common: 'common.js',
        }
      )
    },
    function () {
      compare(dest, expected, t)
    },
  ], cb)
})

test('threshold, array', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['dark-blue.js', 'dark-green.js', 'red.js'],
        { basedir: src },
        dest,
        {
          needFactor: true,
          threshold: ['**/node_modules/**/*.js'],
          common: 'common.js',
        }
      )
    },
    function () {
      compare(dest, expected, t)
    },
  ], cb)
})

test('threshold, function', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['dark-blue.js', 'dark-green.js', 'red.js'],
        { basedir: src },
        dest,
        {
          needFactor: true,
          threshold: function (row) {
            return /colors\/index.js/.test(row.file)
          },
          common: 'common.js',
        }
      )
    },
    function () {
      compare(dest, expected, t)
    },
  ], cb)
})

