var test = require('tap').test
var runSequence = require('callback-sequence').run
var path = require('path')
var del = require('del')
var fixtures = path.resolve.bind(path, __dirname, 'fixtures')
var compare = require('compare-directory')
var bundle = require('./util/bundle')
var dest = fixtures('build')
var src = fixtures('src', 'commonify')

function clean() {
  return del(dest)
}

test('commonify, entries never go to common', function(t) {
  return runSequence([
    clean,
    function () {
      return bundle(
        ['blue.js', 'dark-blue.js', 'light-blue.js', 'dark-red.js'],
        { basedir: src },
        dest,
        {
          needFactor: true,
          common: 'common.js',
        }
      )
    },
    function () {
      compare(t, '*.js', dest, fixtures('expected', 'multiple-bundles-commonify-entries-not-to-common'))
    },
  ])
})

test('commonify, non-entries dedupe go to common', function(t) {
  return runSequence([
    clean,
    function () {
      return bundle(
        ['dark-copy-blue.js', 'dark-blue.js'],
        { basedir: src },
        dest,
        {
          needFactor: true,
          common: 'common.js',
        }
      )
    },
    function () {
      compare(t, '*.js', dest, fixtures('expected', 'multiple-bundles-commonify-dedupe-go-to-common'))
    },
  ])
})

