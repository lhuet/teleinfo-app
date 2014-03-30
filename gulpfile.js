'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    inject = require("gulp-inject"),
    livereload = require('gulp-livereload'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    es = require('event-stream'),
    _ = require('lodash'),
    httpProxy = require('http-proxy'),
    http = require('http'),
    util = require('util'),
    lr = require('tiny-lr'),
    server = lr();


var paths = {
    server_scripts: ['server.js', 'app/**/*.js', '!node_modules/**'],
    frontend: {
        scripts: ['frontend/app/**/*.js'],
        static: ['frontend/app/**/*.html'],
        custom_css: ['frontend/app/**/*.css'],
        home: ['frontend/index.html']
    },
    vendor_files: {
        js: [
            'frontend/vendor/jquery/dist/jquery.js',
            'frontend/vendor/angular/angular.js',
            'frontend/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
/*            'frontend/vendor/angular-ui-router/release/angular-ui-router.js', */
            'frontend/vendor/angular-route/angular-route.js'
        ],
        css: [
            'frontend/vendor/bootstrap/dist/css/bootstrap.min.css',
            'frontend/vendor/bootstrap/dist/css/bootstrap-theme.css'
        ],
        fonts: [
            'frontend/vendor/bootstrap/dist/fonts/**'
        ]
    },
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
    nodemon({ script: 'server.js', verbose: false, ignore: ['gulpfile.js', 'frontend/', 'public/'] })
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

// Frontend static
gulp.task('frontend_static', function() {
    es.merge(
        gulp.src(paths.vendor_files.css)
            .pipe(gulp.dest(paths.dest_static+'/vendor/css')),
        gulp.src(paths.vendor_files.fonts)
            .pipe(gulp.dest(paths.dest_static+'/vendor/fonts')),
        gulp.src(_.union(paths.frontend.scripts, paths.frontend.custom_css, paths.frontend.static))
            .pipe(gulp.dest(paths.dest_static))
    )
        .pipe(livereload(server));
});

// Génération de la home (injection des .css et .js)
gulp.task('frontend_home', ['frontend_static'], function() {

    // Concatenate vendor scripts
    var vendorStream = gulp.src(paths.vendor_files.js)
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest(paths.dest_static));

//    // Concatenate AND minify app sources
//    var appStream = gulp.src(['./src/app/*.js'])
//        .pipe(concat('app.js'))
//        .pipe(uglify())
//        .pipe(gulp.dest('./dist'));


    gulp.src(paths.frontend.home)
        .pipe(inject(vendorStream, {ignorePath: 'public/'}))
        .pipe(inject(gulp.src(paths.vendor_files.css, {read: false}),
            {
                starttag: '<!-- inject:css -->',
                addRootSlash: false,
                ignorePath: 'frontend/vendor/bootstrap/dist/css',
                addPrefix: 'vendor/css'
            }))
        .pipe(inject(gulp.src(_.union(paths.frontend.scripts, paths.frontend.custom_css), {read: false}),
            {
                starttag: '<!-- inject:custom:{{ext}} -->',
                addRootSlash: false,
                ignorePath: 'frontend/app'
            }))
        .pipe(gulp.dest(paths.dest_static))
        .pipe(livereload(server));
});

// Excécution en cas de changement
gulp.task('watch', function() {
    server.listen(35729, function (err) {
        if (err) {
            return console.log(err)
        };
        console.log('Serveur Livereload en écoute sur le port 35729');

        gulp.watch(_.union(paths.frontend.scripts,
                            paths.frontend.custom_css,
                            paths.frontend.static,
                            paths.frontend.home), ['frontend_home']);

    });

});

// Default Task
gulp.task('default', ['lint_frontend', 'lint_server', 'frontend_home', 'watch', 'nodemon']);

