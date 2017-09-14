var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jshint=require('gulp-jshint');

//语法检查
gulp.task('jshint', function () {
    return gulp.src('try/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

gulp.task('default',['jshint'],function() {
    gulp.start('minifycss','minifyjs', 'image');
});

gulp.task('minifyjs', function () {
    gulp.src(['try/js/*.js', 'try/js/*/*.js'])
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('minifycss', function () {
    return gulp.src('try/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('image', function () {
    return gulp.src('try/image/*')
        .pipe(gulp.dest('dist/image'))
});