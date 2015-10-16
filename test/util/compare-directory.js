var glob = require('glob')
var fs = require('fs')
var path = require('path')

function readFile(file) {
  return fs.readFileSync(file, 'utf8').trim()
}

module.exports = function (actual, expected, t, msg, normalize) {
  if (typeof msg !== 'function') {
    msg = function (m) {
      return m
    }
  }
  var actualFiles = glob.sync('**/*.js', { cwd: actual })
  var expectedFiles = glob.sync('**/*.js', { cwd: expected })

  normalize = normalize || function (f) {
    return f
  }
  var normalized = actualFiles.map(normalize).sort()
  expectedFiles.sort()

  t.same(normalized, expectedFiles, msg('filenames should match'))

  var files = actualFiles
  files.forEach(function (f) {
    t.equal(
      readFile(path.resolve(actual, f)),
      readFile(path.resolve(expected, normalize(f))),
      msg(f)
    )
  })
}

