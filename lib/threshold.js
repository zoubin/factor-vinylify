var multimatch = require('multimatch')

module.exports = function (threshold, whitelist, log) {
  return function (row, group) {
    if (log && row.entry && group.length > 1) {
      log(
        'WARN: Entry [', row.file, ']',
        'is dependent upon by other modules',
        '[', group.filter(function (gid) {
          return row.file !== gid
        }).join(','), ']'
      )
    }
    if (threshold === false) {
      return false
    }
    // non factor entries go to common
    if (whitelist.indexOf(row.file) > -1) {
      return true
    }
    if (typeof threshold === 'string' || Array.isArray(threshold)) {
      return multimatch(row.file, threshold).length === 1
    }
    if (threshold && typeof threshold.test === 'function') {
      return threshold.test(row.file)
    }
    if (typeof threshold === 'function') {
      return threshold(row, group)
    }
    if (typeof row.common === 'boolean') {
      return row.common
    }
    return group.length > (+threshold || 1) || group.length === 0
  }
}

