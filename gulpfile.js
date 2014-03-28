'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    inject = require("gulp-inject"),
    livereload = require('gulp-livereload'),
    clean = require('gulp-clean'),
    _ = require('lodash'),
    util = require('util'),
    lr = require('tiny-lr'),
    server = lr();


var paths = {
    server_scripts: ['server.js', 'app/**/*.js', '!node_modules/**'],
    frontend_scripts: ['frontend/app/**/*.js'],
    frontend_static: ['frontend/app/**/*.html'],
    frontend_bootstrap_static: ['frontend/vendor/bootstrap/dist/**'],
    frontend_custom_css: ['frontend/app/**/*.css'],
    home: 'frontend/index.html',
    home_js: ['public/js/*.js'],
    home_css: ['public/css/*.css'],
    home_bootstrap_res: ['frontend/vendor/bootstrap/dist/css/bootstrap.min.css',
                        'frontend/vendor/bootstrap/dist/css/bootstrap-theme.min.css',
                        'frontend/vendor/bootstrap/dist/js/bootstrap.min.js'],
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
    nodemon({ script: 'server.js', ext: 'js', ignore: ['gulpfile.js', 'frontend/**'] })
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

// Suppression du contenu du rep de buils (/public)
gulp.task('clean', function() {
    gulp.src(paths.dest_static, {read: false})
        .pipe(clean());
});

// Génération de la home (injection des .css et .js)
gulp.task('frontend_home', function() {
    gulp.src(paths.home)
        .pipe(inject(gulp.src(paths.home_bootstrap_res, {read: false}),
            {
                addRootSlash: false,  // ensures proper relative paths
                ignorePath: 'frontend/vendor/bootstrap/dist', // ensures proper relative paths
                addPrefix: 'lib/bootstrap'
            }))
        .pipe(inject(gulp.src(_.union(paths.home_css, paths.home_js), {read: false}),
            {
                starttag: '<!-- inject:custom:{{ext}} -->',
                addRootSlash: false,
                ignorePath: 'public'
            }))
        .pipe(livereload(server))
        .pipe(gulp.dest(paths.dest_static));
});

// Frontend static
gulp.task('frontend_static', function() {
    gulp.src(_.union(paths.frontend_static, paths.frontend_scripts, paths.frontend_custom_css))
        .pipe(livereload(server))
        .pipe(gulp.dest(paths.dest_static));
});

// Libs Frontend
gulp.task('frontend_libs', function() {
    gulp.src(paths.frontend_bootstrap_static)
        .pipe(livereload(server))
        .pipe(gulp.dest(paths.dest_static+'/lib/bootstrap'));
});


// Excécution en cas de changement
gulp.task('watch', function() {
    server.listen(35729, function (err) {
        if (err) {
            return console.log(err)
        };
        console.log('Serveur Livereload en écoute sur le port 35729');

        gulp.watch(paths.frontend_static, ['frontend_static', 'frontend_home']);
        gulp.watch(paths.frontend_scripts, ['frontend_home', 'lint_frontend']);
    });

});

// Default Task
gulp.task('default', ['lint_frontend', 'lint_server', 'frontend_home', 'frontend_static', 'frontend_libs', 'watch', 'nodemon']);