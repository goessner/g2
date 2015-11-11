"use strict";
var fs = require("fs");
var gulp = require("gulp");
var gulpJsdoc2md = require("gulp-jsdoc-to-markdown");
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');

gulp.task("doc", function(){
    return gulp.src("g2.js")
        .pipe(gulpJsdoc2md())
        .pipe(rename("README.md"))
        .pipe(gulp.dest("api"));
});
gulp.task('compress', function() {
  return gulp.src('g2.js')
    .pipe(rename({ extname: '.min.js' }))
    .pipe(uglify())
	.pipe(gulp.dest(''))
	.pipe(gzip())
    .pipe(gulp.dest(''));
});