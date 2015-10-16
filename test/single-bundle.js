var test = require('tape')
var runSequence = require('callback-sequence').run
var path = require('path')
var del = require('del')

var fixtures = path.resolve.bind(path, __dirname)

var compare = require('./util/compare-directory')
var bundle = require('./util/bundle')

var dir = 'single-bundle'
var dest = fixtures('build', dir)
var expect = fixtures('expected', dir)
var src = fixtures('src', dir)

function clean() {
  return del(dest)
}
function bundleTask(fopts) {
  return bundle(
    ['green.js', 'red.js'], { basedir: src },
    dest, fopts
  )
}

test('single-bundle', function(t, cb) {
  function bundleCmp(msg) {
    compare(dest, expect, t, function (m) {
      return msg + ':\t' + m
    }, function (f) {
      if (f === 'bundle.js') {
        return 'common.js'
      }
      return f
    })
  }
  runSequence([
    clean,
    bundleTask.bind(null, null),
    bundleCmp.bind(null, 'default options'),

    clean,
    bundleTask.bind(null, 'bundle.js'),
    bundleCmp.bind(null, 'string options'),

    clean,
    bundleTask.bind(null, { common: 'bundle.js' }),
    bundleCmp.bind(null, 'opts.common'),
  ], cb)
})

