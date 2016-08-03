var gulp = require('gulp');
var fs = require('fs');

fs.readdirSync(__dirname +'/gulp').forEach(function(task) {
    require('./gulp/' +task);
});

gulp.task('watch:js', ['js'], function() {
    gulp.watch('public/js/**/*.js', ['js']);
});

gulp.task('watch:css', ['css'], function() {
    gulp.watch('public/css/**/*.styl', ['css']);
});

gulp.task('default', ['js','watch:js','watch:css','server']);