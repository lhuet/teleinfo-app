'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish');


var paths = {
    server_scripts: ['server.js', 'app/**/*.js', '!node_modules/**'],
    frontend_scripts: ['frontend/js/**/*.js'],
    frontend_static: ['frontend/**/*.html', 'frontend/img/**'],
    css: ['frontend/css/*.css'],
    dest_static: 'public'
};

// Lint serveur
gulp.task('lint_server', function() {
    gulp.src(paths.server_scripts)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// Lint frontend
gulp.task('lint_frontend', function() {
    gulp.src(paths.server_scripts)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});


// Frontend
gulp.task('frontend', function() {
    gulp.src(paths.frontend_static)
        .pipe(gulp.dest(paths.dest_static));
});

gulp.task('nodemon', function() {
    nodemon({ script: 'server.js', ext: 'html js', ignore: ['gulpfile.js'] })
        .on('change', ['lint_server']);
});

// Default Task
gulp.task('default', ['lint_frontend', 'lint_server', 'frontend', 'nodemon']);