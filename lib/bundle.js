var merge = require('merge-stream')
var thr = require('through2')
var buffer = require('vinyl-buffer')
var path = require('path')

module.exports = function (b, opts) {
  var bundle = b.bundle.bind(b)
  b.bundle = function () {
    var out = buffer()
    var stream = merge()

    function handleError(err) {
      delete err.stream
      out.emit('error', err)
    }

    var createCommon = opts.common || !opts.needFactor
    if (createCommon) {
      b.emit('factor.pipeline', path.resolve(opts.basedir, opts.common || 'common.js'), b.pipeline)
    }
    var common = bundle().on('error', handleError)
    if (createCommon) {
      stream.add(
        common.pipe(
          opts.toVinylStream(opts.common || 'common.js', opts.basedir)
        ).on('error', handleError)
      )
    }
    if (opts.needFactor) {
      var wait = thr.obj()
      stream.add(wait)
      b.once('factor.outputs', function (streams) {
        streams.forEach(function (s) {
          s.on('error', handleError)
        })
        stream.add(streams)
        wait.end()
      })
    }

    return stream.pipe(out)
  }
}

