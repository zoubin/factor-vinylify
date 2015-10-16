
module.exports = function (b, opts) {
  opts = opts || {}
  if (typeof opts === 'string') {
    opts = { common: opts }
  }
  var needFactor = opts.entries || opts.outputs || opts.needFactor
  var common = opts.common
  if (needFactor) {
    if (!common) {
      opts.commonFilter = false
    }
    b.plugin(require('./lib/factor'), opts)
  } else {
    common = common || 'common.js'
  }
  b.plugin(require('./lib/dedupify'), { noCommon: !common })
  b.plugin(require('./lib/bundle'), {
    common: common,
    needFactor: needFactor,
    basedir: opts.basedir || b._options.basedir,
  })

}
