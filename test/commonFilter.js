var test = require('tape')
var runSequence = require('callback-sequence').run
var path = require('path')
var del = require('del')

var fixtures = path.resolve.bind(path, __dirname)

var compare = require('./util/compare-directory')
var bundle = require('./util/bundle')

var src = fixtures('src', 'multiple-bundles')

test('commonFilter', function(t, cb) {
  var dir = 'common-filter'
  var dest = fixtures('build', dir)
  var expect = fixtures('expected', dir)
  var filterMode = 'string'

  function cmp() {
    ncmp()
  }
  function ncmp(normalize) {
    compare(dest, expect, t, function (m) {
      return filterMode + ':\t' + m
    }, normalize)
  }

  function clean() {
    return del(dest)
  }

  function reset(s) {
    filterMode = s
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
      commonFilter: path.join(src, 'dark.js'),
      common: 'common.js',
    }),
    cmp,

    reset.bind(null, 'function'),
    clean,
    pack.bind(null, {
      needFactor: true,
      commonFilter: function (f) {
        return f === path.join(src, 'dark.js')
      },
      common: 'common.js',
    }),
    cmp,

    reset.bind(null, 'RegExp'),
    clean,
    pack.bind(null, {
      needFactor: true,
      commonFilter: /dark\.js$/,
      common: 'common.js',
    }),
    cmp,

    reset.bind(null, 'Array'),
    clean,
    pack.bind(null, {
      needFactor: true,
      commonFilter: [/dark\.js$/],
      common: 'common.js',
    }),
    cmp,

  ], cb)
})

