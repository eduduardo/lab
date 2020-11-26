'use strict';

/**
 * Basic concept follows https://www.justinmccandless.com/post/a-tutorial-for-getting-started-with-gulp/
 */
const gulp = require('gulp');
const watch = require('gulp-watch');

// Include plug-ins
const babel = require('gulp-babel');
const del = require('del');

// Base for specifying paths in gulp.src and gulp.dest
const distDir = '_dist/';

// Clean the dist directory
function _clean() {
    return del(distDir);
};

// Copy all files to the dist directory
function _copy() {
    return gulp.src(['src/**/*']).pipe(gulp.dest(distDir));
};

// Transpile the javascript files to ES5 in the dist directory (in-place)
function _javascripts() {
    return gulp.src('js/**/*.js', {base: distDir, cwd: distDir})
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest(distDir));
};

// Default task producing a jekyll-ready site in the dist folder
gulp.task('default', gulp.series(_clean, _copy, _javascripts));

// Add gulp watch files for automatically reload
gulp.task('watch', function () {
    return watch('src/**/*', gulp.series(_copy, _javascripts));
});

// Run Jekyll
gulp.task('jekyll', gulp.series('default', function (gulpCallBack) {
    let spawn = require('child_process').spawn;
    let jekyll = spawn('jekyll', ['serve'], {stdio: 'inherit'});

    jekyll.on('exit', function (code) {
        gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: ' + code);
    });
}));
