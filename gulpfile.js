'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	webpack = require('gulp-webpack'),
	minifycss = require('gulp-minify-css'),
	ngAnnotate = require('gulp-ng-annotate');


/* ---------------------------------- */
/* --------- BEGIN APP:STYLE --------- */
/* ---------------------------------- */
gulp.task('sass', function () {
  return gulp.src('src/sass/common.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename('app.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('public/css/app/'));
});

gulp.task('sass:watch', function () {
  gulp.watch('src/sass/common.scss', ['sass']);
});

gulp.task('minifycss', function() {
  return gulp.src([
  	'node_modules/bootstrap/dist/css/bootstrap.css',
  	'node_modules/ng-tags-input/build/ng-tags-input.css'
  	])
  .pipe(minifycss())
  .pipe(concat('external.min.css',{
  	newLine:'\n;'
  }))
  .pipe(gulp.dest('public/css/app/'));
});
/* ---------------------------------- */
/* --------- END APP:STYLE --------- */
/* ---------------------------------- */


/* ---------------------------------- */
/* --------- BEGIN APP:JS --------- */
/* ---------------------------------- */
gulp.task('minifyplugins', function() {
  gulp.src([
    'node_modules/angular/angular.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/ng-tags-input/build/ng-tags-input.min.js'
  ])
  .pipe(concat('external.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('public/js/app/'));
});

gulp.task('webpack:build', function() {
    var stream = gulp.src('src/js/app/main.js')
        .pipe(webpack({
            output: {
                filename: "build.js"
            }
        }))
        .pipe(gulp.dest('src/js/'));

    return stream;
});

// TO:DO Add EsLint

gulp.task('default',['webpack:build'], function () {
	return gulp.src('src/js/build.js')
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
		.pipe(gulp.dest('public/js/app/'));
});
/* ---------------------------------- */
/* --------- END APP:JS --------- */
/* ---------------------------------- */


/* --------- DEPLOY APP --------- */
gulp.task('deploy',['sass','minifycss','minifyplugins','default']);
/* --------- DEPLOY APP --------- */