var thr = require('through2')

module.exports = function (b) {
  b.on('reset', dedupify)
  dedupify()

  function dedupify() {
    var undef
    b.pipeline.get('dedupe').unshift(thr.obj(function (row, enc, next) {
      /**
       * If `entry` is deduped against another module,
       * that module should always be packed together with `entry`,
       * which will cause problems with `threshold`
       *
       */
      if (row.entry && row.dedupe) {
        row.dedupe = undef
        row.dedupeIndex = undef
      }
      next(null, row)
    }))
  }
}
