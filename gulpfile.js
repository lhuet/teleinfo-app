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

/**** Tâches Serveur ****/
/************************/

// Lint serveur
gulp.task('lint_server', function() {
    gulp.src(paths.server_scripts)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('nodemon', function() {
    nodemon({ script: 'server.js', ext: 'js', ignore: ['gulpfile.js'] })
        .on('change', ['lint_server']);
});


/**** Tâches Frontend ****/
/*************************/

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

// Excécution en cas de changement
gulp.task('watch', function() {
    gulp.watch(paths.frontend_static, ['frontend']);
});

// Default Task
gulp.task('default', ['lint_frontend', 'lint_server', 'frontend', 'watch', 'nodemon']);