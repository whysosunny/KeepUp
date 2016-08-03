var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('js', function() {
    gulp.src(['public/js/app.js','public/js/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(ngAnnotate())
        // .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/assets'));
});

