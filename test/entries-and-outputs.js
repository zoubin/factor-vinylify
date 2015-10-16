var test = require('tape')
var runSequence = require('callback-sequence').run
var path = require('path')
var del = require('del')

var fixtures = path.resolve.bind(path, __dirname)

var compare = require('./util/compare-directory')
var bundle = require('./util/bundle')

var src = fixtures('src', 'multiple-bundles')

test('entries and outputs', function(t, cb) {
  var dir = 'default-factor-entries'
  var dest = fixtures('build', dir)
  var expect = fixtures('expected', dir)

  function cmp() {
    ncmp()
  }
  function ncmp(normalize) {
    compare(dest, expect, t, function (m) {
      return dir + ':\t' + m
    }, normalize)
  }

  function clean() {
    return del(dest)
  }

  function reset(d) {
    dir = d
    dest = fixtures('build', dir)
    expect = fixtures('expected', dir)
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
    }),
    cmp,

    reset.bind(null, 'common-default-factor-entries'),
    clean,
    pack.bind(null, {
      needFactor: true,
      common: 'common.js',
    }),
    cmp,

    reset.bind(null, 'array-filter-factor-entries'),
    clean,
    pack.bind(null, {
      entries: ['blue.js', 'green.js'],
      common: 'common.js',
    }),
    cmp,

    reset.bind(null, 'function-filter-factor-entries'),
    clean,
    pack.bind(null, {
      entries: function (bentries) {
        return bentries.filter(function (p) {
          var base = path.basename(p)
          return base === 'blue.js' || base === 'green.js'
        })
      },
      common: 'common.js',
    }),
    cmp,

    reset.bind(null, 'function-outputs'),
    clean,
    pack.bind(null, {
      outputs: function (entries) {
        return entries.map(function (p) {
          return path.join(
            path.dirname(p),
            'xxx-' + path.basename(p)
          )
        })
      },
      common: 'common.js',
    }),
    ncmp.bind(null, function (p) {
      return p.replace('xxx-', '')
    }),

  ], cb)
})

