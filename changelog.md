<!-- 91f4905 1450249975000 -->

## [v3.0.4](https://github.com/zoubin/factor-vinylify/commit/91f4905) (2015-12-16)

* [[`e0750f5`](https://github.com/zoubin/factor-vinylify/commit/e0750f5)] Update callback-sequence

## [v3.0.3](https://github.com/zoubin/factor-vinylify/commit/64c80ce) (2015-12-16)

* [[`fd8d904`](https://github.com/zoubin/factor-vinylify/commit/fd8d904)] Handle empty browserify entries

* [[`d365744`](https://github.com/zoubin/factor-vinylify/commit/d365744)] CHANGELOG

## [v3.0.2](https://github.com/zoubin/factor-vinylify/commit/780e53b) (2015-12-06)

* [[`17a7f7b`](https://github.com/zoubin/factor-vinylify/commit/17a7f7b)] Update arr-diff

* [[`e213c5b`](https://github.com/zoubin/factor-vinylify/commit/e213c5b)] Use tap

* [[`8875878`](https://github.com/zoubin/factor-vinylify/commit/8875878)] CHANGELOG

## [v3.0.1](https://github.com/zoubin/factor-vinylify/commit/36b69f7) (2015-11-06)

* [[`69d67e2`](https://github.com/zoubin/factor-vinylify/commit/69d67e2)] Bugfix: emit `factor.pipeline` for common after bundle

    
    In some cases, `b.pipeline` may need to be modified through listening `factor.pipeline`.
    However, in watch mode, `b.bundle()` will rebuild the pipeline.
    So we'd better emit `factor.pipeline` after `b.bundle()`

* [[`9fc66c9`](https://github.com/zoubin/factor-vinylify/commit/9fc66c9)] readme

* [[`1927b86`](https://github.com/zoubin/factor-vinylify/commit/1927b86)] rm browserify from dependencies

## [v3.0.0](https://github.com/zoubin/factor-vinylify/commit/c8d5702) (2015-11-02)

* [[`153ce9d`](https://github.com/zoubin/factor-vinylify/commit/153ce9d)] use browserify 12 for tests

* [[`390d21f`](https://github.com/zoubin/factor-vinylify/commit/390d21f)] refactor code. no commonFilter option. use threshold instead

* [[`2d699f2`](https://github.com/zoubin/factor-vinylify/commit/2d699f2)] update gulp-tape

## [v2.0.2](https://github.com/zoubin/factor-vinylify/commit/9da1830) (2015-10-30)

* [[`206d171`](https://github.com/zoubin/factor-vinylify/commit/206d171)] bugfix: `bundle` never fires when `common` is disabled

## [v2.0.1](https://github.com/zoubin/factor-vinylify/commit/1c9badc) (2015-10-24)

* [[`a39e3d2`](https://github.com/zoubin/factor-vinylify/commit/a39e3d2)] propagate error

* [[`0ef4ad2`](https://github.com/zoubin/factor-vinylify/commit/0ef4ad2)] update task-tape

## [v2.0.0](https://github.com/zoubin/factor-vinylify/commit/8b5d918) (2015-10-23)

* [[`c272d56`](https://github.com/zoubin/factor-vinylify/commit/c272d56)] fire `factor.pipeline` for common

* [[`e998c70`](https://github.com/zoubin/factor-vinylify/commit/e998c70)] readme fix coverage

* [[`f1900f3`](https://github.com/zoubin/factor-vinylify/commit/f1900f3)] do not upload coverage when run tests

## [v1.0.0](https://github.com/zoubin/factor-vinylify/commit/ffd5dad) (2015-10-16)

* [[`84378d0`](https://github.com/zoubin/factor-vinylify/commit/84378d0)] more tests, coverage

* [[`9b6b61e`](https://github.com/zoubin/factor-vinylify/commit/9b6b61e)] readme

## [v0.1.1](https://github.com/zoubin/factor-vinylify/commit/ea7fb9e) (2015-09-24)

* [[`a1f66c2`](https://github.com/zoubin/factor-vinylify/commit/a1f66c2)] version

* [[`fbaaa67`](https://github.com/zoubin/factor-vinylify/commit/fbaaa67)] 0.2.1

* [[`579dbde`](https://github.com/zoubin/factor-vinylify/commit/579dbde)] readme

* [[`125678d`](https://github.com/zoubin/factor-vinylify/commit/125678d)] Revert "readme"

    
    This reverts commit 907490efe7a7b905a2f722632f0216d379109c8b.

* [[`a7f1570`](https://github.com/zoubin/factor-vinylify/commit/a7f1570)] 0.2.0

* [[`907490e`](https://github.com/zoubin/factor-vinylify/commit/907490e)] readme

## [v0.1.0](https://github.com/zoubin/factor-vinylify/commit/cc075f9) (2015-09-24)

* [[`839f31f`](https://github.com/zoubin/factor-vinylify/commit/839f31f)] vinylify factor-bundle

* [[`d8f9a86`](https://github.com/zoubin/factor-vinylify/commit/d8f9a86)] Initial commit

