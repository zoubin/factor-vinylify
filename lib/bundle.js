var source = require('vinyl-source-stream');
var merge = require('merge-stream');
var thr = require('through2');
var buffer = require('vinyl-buffer');

module.exports = function (b, opts) {
  var bundle = b.bundle.bind(b);
  b.bundle = function () {
    var stream = merge();

    function handleError(err) {
      Object.keys(err).forEach(function (k) {
        var t = typeof err[k];
        if (t !== 'string' && t !== 'number') {
          delete err[k];
        }
      });
      stream.emit('error', err);
    }

    var common = bundle().on('error', handleError);
    if (opts.common || !opts.needFactor) {
      stream.add(
        common.pipe(
          source(opts.common || 'common.js', opts.basedir)
        ).on('error', handleError)
      );
    }
    if (opts.needFactor) {
      var wait = thr.obj();
      stream.add(wait);
      b.once('factor.outputs', function (streams) {
        streams.forEach(function (s) {
          s.on('error', handleError);
        });
        stream.add(streams);
        wait.end();
      });
    }

    return stream.pipe(buffer());
  };
};

