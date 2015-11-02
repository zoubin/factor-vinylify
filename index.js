var source = require('vinyl-source-stream')
var mix = require('util-mix')

module.exports = function (b, opts) {
  if (typeof opts === 'string') {
    opts = { common: opts }
  }
  opts = mix({
    dedupify: true,
    commonify: true,
    toVinylStream: source,
  }, opts)

  var common = opts.common
  var needFactor = opts.entries || opts.outputs || opts.needFactor

  if (needFactor) {
    if (!common) {
      opts.threshold = false
    }
    b.plugin(require('./lib/factor'), opts)
  } else {
    common = common || 'common.js'
  }

  if (opts.dedupify) {
    b.plugin(require('./lib/dedupify'))
  }

  if (opts.commonify) {
    b.plugin(require('./lib/commonify'), { noCommon: !common })
  }

  b.plugin(require('./lib/bundle'), {
    common: common,
    needFactor: needFactor,
    toVinylStream: opts.toVinylStream,
    basedir: opts.basedir || b._options.basedir,
  })

}
