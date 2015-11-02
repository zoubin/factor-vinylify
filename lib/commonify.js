var thr = require('through2')

module.exports = function (b, opts) {
  opts = opts || {}
  b.on('reset', commonify)
  commonify()

  function commonify() {
    b.pipeline.get('dedupe').unshift(thr.obj(function (row, enc, next) {
      /**
       * If `entry` is factored into `common.js`,
       * this module will be executed on each page,
       * which probably is not desirable
       *
       */
      if (row.entry) {
        row.common = false
      }

      /**
       * If not `entry`, but `dedupe`,
       * it must be bundled with the module deduped against
       * So, we pack all of them into common
       * Since the deduped `row` depends on its dedupe,
       * if `row` is packed into common,
       * its dedupe will also be there.
       */
      if (!row.entry && row.dedupe) {
        row.common = true
      }

      if (opts && opts.noCommon) {
        row.common = false
      }

      next(null, row)
    }))
  }
}

