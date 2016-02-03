'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');

gulp.task('sass', function () {
  return gulp.src('./style/sass/common.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename('common.min.css'))
    .pipe(gulp.dest('./style'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./style/sass/common.scss', ['sass']);
});