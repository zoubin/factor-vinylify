var test = require('tape')
var runSequence = require('callback-sequence').run
var path = require('path')
var del = require('del')
var fixtures = path.resolve.bind(path, __dirname, 'fixtures')
var compare = require('./util/compare-directory')
var bundle = require('./util/bundle')
var dest = fixtures('build')
var src = fixtures('src', 'dedupify')
var expected = fixtures('expected', 'dedupify')
var fs = require('fs')

function clean() {
  return del(dest)
}

test('dedupify', function(t, cb) {
  runSequence([
    clean,
    function () {
      return bundle(
        ['blue.js', 'blue.copy.js', 'red.js'],
        { basedir: src },
        dest,
        {
          needFactor: true,
          common: 'common.js',
        }
      )
    },
    function () {
      t.equal(
        fs.readFileSync(path.join(src, 'blue.js'), 'utf8'),
        fs.readFileSync(path.join(src, 'blue.copy.js'), 'utf8'),
        'should contain the same contents'
      )
      compare(dest, expected, t)
    },
  ], cb)
})

