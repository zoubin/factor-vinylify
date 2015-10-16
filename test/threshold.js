var test = require('tape')
var runSequence = require('callback-sequence').run
var path = require('path')
var del = require('del')

var fixtures = path.resolve.bind(path, __dirname)

var compare = require('./util/compare-directory')
var bundle = require('./util/bundle')

var src = fixtures('src', 'threshold')

test('threshold', function(t, cb) {
  var dir = 'threshold'
  var dest = fixtures('build', dir)
  var expect = fixtures('expected', dir)
  var mode = 'threshold-number'

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

  function reset(s) {
    mode = s
  }

  function pack(fopts) {
    return bundle(
      ['blue.js', 'green.js', 'red.js'],
      { basedir: src },
      dest,
      fopts
    )
  }

  runSequence([

    clean,
    pack.bind(null, {
      needFactor: true,
      threshold: 2,
      common: 'common.js',
    }),
    cmp,

    reset.bind(null, 'threshold-function'),
    clean,
    pack.bind(null, {
      needFactor: true,
      threshold: function (row, groups) {
        return groups.length > 2
      },
      common: 'common.js',
    }),
    cmp,

  ], cb)
})

