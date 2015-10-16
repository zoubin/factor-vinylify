var test = require('tape')
var runSequence = require('callback-sequence').run
var path = require('path')
var del = require('del')

var fixtures = path.resolve.bind(path, __dirname)

var compare = require('./util/compare-directory')
var bundle = require('./util/bundle')

var src = fixtures('src', 'dedupe')

test('dedupify', function(t, cb) {
  var dir = 'dedupe'
  var dest = fixtures('build', dir)
  var expect = fixtures('expected', dir)
  var mode = dir

  function cmp() {
    ncmp()
  }
  function ncmp(normalize) {
    compare(dest, expect, t, function (m) {
      return mode + ':\t' + m
    }, normalize)
  }

  function clean() {
    return del(dest)
  }

  function pack(fopts) {
    return bundle(
      ['blue.js', 'blue.copy.js', 'green.js', 'green-red.js', 'red.js'],
      { basedir: src },
      dest,
      fopts
    )
  }

  runSequence([

    clean,
    pack.bind(null, {
      needFactor: true,
      common: 'common.js',
    }),
    cmp,

  ], cb)
})

