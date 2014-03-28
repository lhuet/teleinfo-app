'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish');

var paths = {
    scripts: ['**/*.js', '!node_modules/**']
};

// Lint Task
gulp.task('lint', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('nodemon', function() {
    nodemon({ script: 'server.js', ext: 'html js', ignore: ['gulpfile.js'] })
        .on('change', ['lint']);
});

// Default Task
gulp.task('default', ['lint', 'nodemon']);