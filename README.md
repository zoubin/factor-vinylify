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
and can be transformed by [gulp](https://www.npmjs.com/package/gulp) plugins.

To use [watchify](https://www.npmjs.com/package/watchify) with factor-bundle, try [reduce-js](https://github.com/zoubin/reduce-js).

## TOC

- [example](#example)
- [options](#options)
- [details](#details)
  - [single bundle](#single-bundle)
  - [multiple bundles](#multiple-bundles)
  - [entry problems](#entry-problems)
  - [dedupe problems](#dedupe-problems)

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

gulp.task('default', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  }
  return browserify(opts)
    .plugin(vinylify, {
      entries: ['green.js', 'red.js'],
      outputs: ['green.js', 'red.js'],
      common: 'common.js',
    })
    .bundle()
    .on('log', log)
    .on('error', log)
    .pipe(uglify())
    .pipe(gulp.dest(DEST))
})

```

## options

### entries

Type: `Function`, `Array`

The factor entries.

If `Function`, it receives all the browserify entries (`b._options.entries`),
and should return an array of factor entries.

If not specified, all browserify entries will be used as factor entries.

Browserify will detect a dependency graph from the browserify entries.
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


### outputs

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

Type: `Number`, `Function`

It serves the same purpose with [factor-bundle#threshold](https://github.com/substack/factor-bundle/#var-fr--factorfiles-opts),
and they share the same signature.

However, its effect is restricted by some rules,
which are described [later](#details).

### common

Type: `String`

The file path for the common bundle.

### commonFilter

Type: `Array`

File paths for modules which are intended for the common bundle.

You can specify some non-entry modules (like jQuery) to be packed into the common bundle always.

Remeber that the paths are resolved against `b._options.basedir`,
and probably you would have to pass them absolute.

## details

### single bundle

If none of `options.entries`, `options.outputs` and `options.needFactor` is truthy,
only the common bundle will be created:

```javascript
gulp.task('single-bundle', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  }
  return browserify(opts)
    .plugin(vinylify, { common: 'common.js' })
    .bundle()
    .on('log', log)
    .on('error', log)
    .pipe(uglify())
    .pipe(gulp.dest(DEST))
})

```

### multiple bundles

`factor-bundle` will be used when `options.entries`,
or `options.outputs`, or `options.needFactor` is truthy.

#### bundle for each browserify entry

To create a bundle for each browserify entry,
specify `options.needFactor` as true,
and do not specify `options.entries`:

```javascript
gulp.task('bundle-for-each-browserify-entry', ['clean'], function () {
  var opts = {
    entries: ['blue.js', 'green.js', 'red.js'],
    basedir: fixtures('src'),
  }
  return browserify(opts)
    .plugin(vinylify, {
      needFactor: true,
      common: 'common.js',
    })
    .bundle()
    .on('log', log)
    .on('error', log)
    .pipe(uglify())
    .pipe(gulp.dest(DEST))
})

```

#### suppress the common bundle

Specify only `options.needFactor`.

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
    .bundle()
    .on('log', log)
    .on('error', log)
    .pipe(uglify())
    .pipe(gulp.dest(DEST))
})

```

### entry problems

Browserify entries are distinguished from normal modules,
due to their immediate execution when loaded.

So, you should use them in a more careful way.

#### never require an entry

Browserify entries should never be required by other modules,
because the executing order of entries in a bundle
is determined by their order of being added into browserify.

#### entries in common

If we never require browserify entries,
and want some of them packed into the common bundle,
the best way is to filter them out of the factor entries.

### dedupe problems
The way browserify handles modules
whose contents are exactly the same
has some subtle problems
(See [factor-bundle#51](https://github.com/substack/factor-bundle/issues/51)).

To make bundles work properly,
rules are established to control the dedupe behavior.

#### deduped modules always go to common
As stated in [#51](https://github.com/substack/factor-bundle/issues/51),
if a deduped module is not packed into the same bundle with the module it is deduped against,
the deduped module won't work.

So, all deduped modules, together with the module they are deduped against will be packed into the common bundle.

#### entries never deduped

Most entries will be excluded from the common bundle,
so they will also be kept from being deduped.


