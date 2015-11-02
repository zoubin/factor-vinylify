# factor-vinylify
Provide a `bundle` function to create a vinyl stream flowing browserify outputs.

[![npm](https://nodei.co/npm/factor-vinylify.png?downloads=true)](https://www.npmjs.org/package/factor-vinylify)

[![version](https://img.shields.io/npm/v/factor-vinylify.svg)](https://www.npmjs.org/package/factor-vinylify)
[![status](https://travis-ci.org/zoubin/factor-vinylify.svg?branch=master)](https://travis-ci.org/zoubin/factor-vinylify)
[![coverage](https://img.shields.io/coveralls/zoubin/factor-vinylify.svg)](https://coveralls.io/github/zoubin/factor-vinylify)
[![dependencies](https://david-dm.org/zoubin/factor-vinylify.svg)](https://david-dm.org/zoubin/factor-vinylify)
[![devDependencies](https://david-dm.org/zoubin/factor-vinylify/dev-status.svg)](https://david-dm.org/zoubin/factor-vinylify#info=devDependencies)


Based on [factor-bundle](https://www.npmjs.com/package/factor-bundle),
this plugin provides some sugar ways to configure factor-bundle,
and makes `b.bundle` output a [vinyl](https://www.npmjs.com/package/vinyl) stream,
which flows all output file objects
to be transformed by [gulp](https://www.npmjs.com/package/gulp) plugins.

To use [watchify](https://www.npmjs.com/package/watchify) with factor-bundle, try [reduce-js](https://github.com/zoubin/reduce-js).

## example

See the files in the `example` directory.

```javascript
var vinylify = require('..')
var browserify = require('browserify')

var path = require('path')
var del = require('del')
var gutil = require('gulp-util')
var uglify = require('gulp-uglify')
var gulp = require('gulp')

var fixtures = path.resolve.bind(path, __dirname)
var log = gutil.log.bind(gutil)
var DEST = fixtures('build')

gulp.task('clean', function () {
  return del(DEST)
})

gulp.task('outputs', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  }
  return browserify(opts)
    .plugin(vinylify, {
      outputs: ['page/blue.js', 'page/green.js', 'page/red.js'],
      common: 'common.js'
    })
    .on('log', log)
    .on('error', log)
    .bundle()
    .pipe(uglify())
    .pipe(gulp.dest(DEST))
})

gulp.task('rename', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  }
  return browserify(opts)
    .plugin(vinylify, {
      needFactor: true,
      common: 'common.js'
    })
    .on('log', log)
    .on('error', log)
    .bundle()
    .pipe(rename(function (p) {
      if (p.basename === 'common') {
        return p
      }
      p.dirname += '/page'
      return p
    }))
    .pipe(uglify())
    .pipe(gulp.dest(DEST))
})

```

## options

### entries
Specify the factor entries.

Type: `Function`, `Array`

If `Function`, it receives all the browserify entries (`b._options.entries`),
and should return an array of factor entries.

If not specified, all browserify entries will be used as factor entries.

Browserify will detect a dependency graph from the inputed browserify entries.
And factor-bundle will put them into several groups according to the factor entries,
which are packed into bundles later.

Usually, a factor entry corresponds to a page-specific bundle.
And modules shared by all page-specific bundles go to a common bundle.

As browserify entries are executed when the bundles containing them loaded,
factor entries are also browserify entries at most times.

However, browserify entries that are not factor entries will go to the common bundle,
and thus executed on every page.
So, if you don't want to create a bundle for each browserify entry,
be careful to choose the factor entries.

Each element can be either an absolte path or one relative to `b._options.basedir` (not necessarily `options.basedir`).

**NOTE**: browserify entries metioned here are only those directly passed to the browserify constructor,
not including those added by `b.add`.


### outputs
Specify the output file paths.
You can also use [gulp-rename](https://github.com/hparra/gulp-rename) to do this job instead.

Type: `Function`, `Array`

If `Function`, it receives the factor entries,
and should return an array of file paths.

The outputs array should pair with the factor entries array.

Each element will be used as the file path for the corresponding factor bundle.
It could be an absolute path,
or one relative to `options.basedir`.

Each output file path will be passed to [vinyl-source-stream](https://www.npmjs.com/package/vinyl-source-stream) as the first argument,
with `options.basedir` as the second,
to create a vinyl stream.


### basedir

Type: `String`

Passed to [vinyl-source-stream](https://www.npmjs.com/package/vinyl-source-stream) as the second argument to create a vinyl stream.

If not specified, `b._options.basedir` will be used.

### threshold
Specify which files go to the common bundle.

Type: `Array`

Passed to [multimatch](https://github.com/sindresorhus/multimatch),
and matched files are put into the common bundle.

Type: `RegExp`

Any matched files are put into the common bundle.

Type: `Number`, `Function`

It serves the same purpose with [factor-bundle#threshold](https://github.com/substack/factor-bundle/#var-fr--factorfiles-opts),
and they share the same signature.

### common

Type: `String`

The file path for the common bundle.

### needFactor

Type: `Boolean`

Default: `false`

To enable the factor-bundle plugin,
specify one of `entries`, `outputs`, and `needFactor`
as truthy.

Usually,
if you want to use the default entries and outputs options,
you probably need to specify `needFactor` as `true`.

Also, if you want to suppress the common bundle:

```javascript
gulp.task('bundle-for-each-browserify-entry-with-no-common', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  }
  return browserify(opts)
    .plugin(vinylify, {
      needFactor: true,
    })
    .on('log', log)
    .on('error', log)
    .bundle()
    .pipe(uglify())
    .pipe(gulp.dest(DEST))
})

```

### commonify

Type: `Boolean`

Default: `true`

If `true`,

* entries are excluded from the common bundle
* dedupes that are not entries go to the common bundle

As stated in [#51](https://github.com/substack/factor-bundle/issues/51),
if a deduped module is not packed into the same bundle with the module it is deduped against,
the deduped module won't work.
So we put all dedupe into the common bundle to avoid that problem.

If you do want entries go to the common bundle,
specify a proper [threshold](#threshold) option.

### dedupify

Type: `Boolean`

Default: `true`

If `true`, entries will never be deduped.

