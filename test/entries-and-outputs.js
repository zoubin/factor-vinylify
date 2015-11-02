var test = require('tape')
var runSequence = require('callback-sequence').run
var path = require('path')
var del = require('del')
var fixtures = path.resolve.bind(path, __dirname, 'fixtures')
var compare = require('./util/compare-directory')
var bundle = require('./util/bundle')
var dest = fixtures('build')
var src = fixtures('src', 'multiple-bundles')

function clean() {
  return del(dest)
}

test('factor, common', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['blue.js', 'green.js', 'red.js'],
        { basedir: src },
        dest,
        {
          common: 'common.js',
        }
      )
    },
    function () {
      compare(dest, fixtures('expected', 'single-bundle'), t)
    },
  ], cb)
})

test('factor, string', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['blue.js', 'green.js', 'red.js'],
        { basedir: src },
        dest,
        'common.js'
      )
    },
    function () {
      compare(dest, fixtures('expected', 'single-bundle'), t)
    },
  ], cb)
})

test('factor, default', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['blue.js', 'green.js', 'red.js'],
        { basedir: src },
        dest,
        null
      )
    },
    function () {
      compare(dest, fixtures('expected', 'single-bundle'), t)
    },
  ], cb)
})

test('factor, needFactor', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['blue.js', 'green.js', 'red.js'],
        { basedir: src },
        dest,
        {
          needFactor: true,
        }
      )
    },
    function () {
      compare(dest, fixtures('expected', 'multiple-bundles-without-common'), t)
    },
  ], cb)
})

test('factor, default bundles with common', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['blue.js', 'green.js', 'red.js'],
        { basedir: src },
        dest,
        {
          needFactor: true,
          common: 'common.js',
        }
      )
    },
    function () {
      compare(dest, fixtures('expected', 'multiple-bundles'), t)
    },
  ], cb)
})

test('factor, non factor entries go to common', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['blue.js', 'green.js', 'red.js', 'dark-blue.js'],
        { basedir: src },
        dest,
        {
          entries: ['blue.js', 'green.js', 'red.js'],
          common: 'common.js',
        }
      )
    },
    function () {
      compare(dest, fixtures('expected', 'multiple-bundles-include-non-factor-entries'), t)
    },
  ], cb)
})

test('factor, non-string entries', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['blue.js', 'green.js', { file: './red.js' }],
        { basedir: src },
        dest,
        {
          needFactor: true,
          common: 'common.js',
        }
      )
    },
    function () {
      compare(dest, fixtures('expected', 'multiple-bundles-non-string-entries'), t)
    },
  ], cb)
})

test('factor, entries, function', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['blue.js', 'green.js', 'red.js', 'dark-blue.js'],
        { basedir: src },
        dest,
        {
          entries: function (bentries) {
            return bentries.filter(function (p) {
              var base = path.basename(p)
              return base !== 'dark-blue.js'
            })
          },
          common: 'common.js',
          threshold: function () {
            return false
          },
        }
      )
    },
    function () {
      compare(dest, fixtures('expected', 'multiple-bundles-include-non-factor-entries'), t)
    },
  ], cb)
})

test('factor, outputs, array', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['blue.js', 'green.js', 'red.js'],
        { basedir: src },
        dest,
        {
          outputs: ['page/blue.js', 'page/green.js', 'page/red.js'],
          common: 'common.js',
        }
      )
    },
    function () {
      compare(dest, fixtures('expected', 'multiple-bundles-outputs'), t)
    },
  ], cb)
})

test('factor, outputs, function', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['blue.js', 'green.js', 'red.js'],
        { basedir: src },
        dest,
        {
          outputs: function (entries) {
            return entries.map(function (file) {
              return path.join(
                path.dirname(file), 'page', path.basename(file)
              )
            })
          },
          common: 'common.js',
        }
      )
    },
    function () {
      compare(dest, fixtures('expected', 'multiple-bundles-outputs'), t)
    },
  ], cb)
})

test('factor, outputs, gulp-rename', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['blue.js', 'green.js', 'red.js'],
        { basedir: src },
        dest,
        {
          needFactor: true,
          common: 'common.js',
        },
        function (p) {
          if (p.basename === 'common') {
            return p
          }
          p.dirname += '/page'
          return p
        }
      )
    },
    function () {
      compare(dest, fixtures('expected', 'multiple-bundles-outputs'), t)
    },
  ], cb)
})

