var path = require('path')
var factor = require('factor-bundle')

var createThreshold = require('./threshold')
var diff = require('arr-diff')

module.exports = function (b, opts) {
  opts = opts || {}

  var bopts = b._options
  var basedir = opts.basedir || bopts.basedir

  function abs(file) {
    if (typeof file === 'string') {
      return path.resolve(bopts.basedir, file)
    }
    return file
  }

  var bentries = bopts.entries.map(abs)

  var entries = opts.entries
  if (typeof opts.entries === 'function') {
    entries = opts.entries(bentries)
  }
  if (!Array.isArray(entries)) {
    entries = bentries
  } else {
    entries = entries.map(abs)
  }

  var outputs = opts.outputs
  if (typeof opts.outputs === 'function') {
    outputs = opts.outputs(entries)
  }
  if (!Array.isArray(outputs)) {
    outputs = entries
  }

  var commonFilter = opts.commonFilter
  if (commonFilter !== false) {
    commonFilter = diff(bentries, entries)
      .concat(
        [].concat(commonFilter)
          .filter(Boolean)
          .map(abs)
      )
  }

  b.plugin(factor, {
    basedir: basedir,
    entries: entries,
    outputs: function () {
      var streams = outputs.map(function (o, i) {
        var s = opts.toVinylStream(o, basedir)
        s.from = entries[i]
        s.to = path.resolve(basedir, o)
        return s
      })
      b.emit('factor.outputs', streams)
      return streams
    },
    threshold: createThreshold(
      opts.threshold,
      commonFilter,
      b.emit.bind(b, 'log')
    ),
  })
}

