var merge = require('merge-stream')
var thr = require('through2')
var duplex = require('duplexify')

module.exports = function (b, opts) {
  b.on('reset', reset)
  reset()

  function reset() {
    var input = opts.toVinylStream(opts.common || 'common.js', opts.basedir)
    var output = merge()

    if (opts.common || !opts.needFactor) {
      output.add(input)
    }

    if (opts.needFactor) {
      var wait = thr.obj()
      output.add(wait)
      b.once('factor.outputs', function (streams) {
        streams.forEach(function (s) {
          s.on('error', handleError)
        })
        output.add(streams)
        wait.end()
      })
    }

    b.pipeline.get('wrap').push(duplex.obj(input, output))

    function handleError(err) {
      delete err.stream
      output.emit('error', err)
    }
  }
}

