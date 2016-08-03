var gulp = require('gulp');
var stylus = require('gulp-stylus');

gulp.task('css', function() {
    gulp.src('public/css/**/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('public/assets/'));
});