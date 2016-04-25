'use strict';

require("babel-polyfill")
const gulp = require('gulp')

const del = require('del')
const es = require('event-stream')
const path = require('path')
const glob = require('glob')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const $ = require('gulp-load-plugins')()
const sass = require('gulp-sass')
var browserSync = require('browser-sync').create()

const DIST = 'app'
const ASSETS = 'assets'
const JSASSETS = ASSETS + '/js'
const CSSASSETS = ASSETS + '/css'
const BLADE = 'resources/views'
const JSDIST = DIST + '/js'
const CSSDIST = DIST + '/css'

const dist = function (dist, subpath) {
    return !subpath ? dist : path.join(dist, subpath)
};


gulp.task('clean', done => {
    del.sync([dist(DIST)])
    done();
})


gulp.task('browserify', ['clean'], done => {

    // map function for browserify and friends
    const browserifyMapper = entry => {
        console.log('browserify')
        const transform = [['babelify', {presets: ['es2015']}]]
        const entries = [entry];
        const b = browserify({entries, transform})

        return b.bundle()
            .pipe(source(entry))
            .pipe(buffer())
            .pipe($.sourcemaps.init())
            .pipe($.uglify())
            .on('error', $.util.log)
            .pipe($.sourcemaps.write('./'))
            .pipe($.rename({
                suffix: '.min',
                dirname: '',
            }))
            .pipe(gulp.dest(JSDIST))
    }
    console.log(path.join(JSASSETS, '**', '*.js'))
    glob(path.join(JSASSETS, '**', '*.js'), (err, files) => {
        if (err) {
            done(err);
        }

        const tasks = files.map(browserifyMapper);
        es.merge(tasks).on('end', done);
    })
})

gulp.task('sass', function () {
    console.log('sassify: ' + path.join(CSSASSETS, "**", "*.scss"));
    return gulp
        .src(path.join(CSSASSETS, "**", "*.scss"))
        .pipe(sass())
        .pipe(gulp.dest(CSSDIST));
});

gulp.task('popup', function() {
    return gulp.src(path.join)
})

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });
});

gulp.task('build', ['clean', 'browserify', 'sass'])


gulp.task('watch', ['build', 'browser-sync'], () => {
    gulp.watch([path.join(JSASSETS, '**', '*.js'), path.join(JSASSETS, '*.js'),
        path.join(CSSASSETS, '**', '*.scss'), path.join(CSSASSETS, '*.scss'),
        path.join(ASSETS+"index.html")],
        ['build', 'browser-sync']
    )
})

gulp.task('default', [
    'build'
])


function __pj() {
    return path.join(argument)
}