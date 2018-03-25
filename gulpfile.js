
'use strict'

const gulp = require('gulp')
const watch = require('gulp-watch')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const webpack = require('gulp-webpack')
//const webpackConfig = require('./webpack.config.js')
const minifycss = require('gulp-minify-css')
const less = require('gulp-less')

const scripts = './src/**/*.js'
const libPath = './lib'
const distPath = './dist'
const csss = './src/**/*.css'
const lesss = './src/**/*.less'
const dts = './src/**/*.d.ts';

gulp.task('default', ['build'])

gulp.task('css', function () {
    return gulp.src(csss).pipe(minifycss()).pipe(gulp.dest(libPath))
})

gulp.task('less', function () {
    return gulp.src(lesss).pipe(gulp.dest(libPath))
})

gulp.task('dts', function () {
    return gulp.src(dts).pipe(gulp.dest(libPath))
})

gulp.task('build', ['css', 'less', 'dts'], function () {
    return gulp.src(scripts).pipe(babel({
        presets: ['es2015', 'stage-0', 'react'],
        plugins: [
            "transform-decorators-legacy",
            ['import', [{ "libraryName": "antd", "style": "css" }]]
        ],
    }))/*.pipe(uglify())*/.pipe(gulp.dest(libPath))
})

const devLibPath = './dev/node_modules/djmodules/lib'

gulp.task('css-dev', function () {
    return gulp.src(csss).pipe(minifycss()).pipe(gulp.dest(devLibPath))
})

gulp.task('less-dev', function () {
    return gulp.src(lesss).pipe(less()).pipe(minifycss()).pipe(gulp.dest(devLibPath))
})

gulp.task('dev', ['css-dev', 'less-dev'], function () {
    return gulp.src(scripts).pipe(babel({
        presets: ['es2015', 'react'],
        plugins: [
            "transform-decorators-legacy",
            ['import', [{ "libraryName": "antd", "style": "css" }]]
        ],
    })).pipe(gulp.dest(devLibPath))
})

gulp.task('watch', ['dev'], function () {
    watch(scripts, { debounceDelay: 200 }, function () {
        gulp.start('dev')
    })

    watch(csss, { debounceDelay: 200 }, function () {
        gulp.start('dev')
    })

    watch(lesss, { debounceDelay: 200 }, function () {
        gulp.start('dev')
    })
})