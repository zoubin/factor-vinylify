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

    var common = bundle().on('error', handleError)
    if (opts.common || !opts.needFactor) {
      b.emit('factor.pipeline', path.resolve(opts.basedir, opts.common || 'common.js'), b.pipeline)
      stream.add(
        common.pipe(
          opts.toVinylStream(opts.common || 'common.js', opts.basedir)
        ).on('error', handleError)
      )
    } else {
      // consume `common`, so b.on('bundle', (bundle) => {}) will work
      common.pipe(thr.obj())
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

