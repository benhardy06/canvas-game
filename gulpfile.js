var gulp = require('gulp');
    uglify = require('gulp-uglify');
    rename = require('gulp-rename');
    plumber = require('gulp-plumber');
    browserSync = require('browser-sync');
    reload = browserSync.reload;

//scripts

gulp.task('scripts', function(){
    gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
    .pipe(rename({suffix:'.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(reload({stream:true}))
});


//html
gulp.task('html', function(){
    gulp.src('app/**/*.html')
    .pipe(reload({stream:true}))
})

//css
gulp.task('css', function(){
    gulp.src('app/**/*.css')
    .pipe(reload({stream:true}))
})



//browser sync
gulp.task('browser-sync', function(){
    browserSync({
        server:{
            baseDir:'./app/'
        }
    })
})


gulp.task('watch', function(){
    gulp.watch('app/js/**/*.js', ['scripts'])
    gulp.watch('app/**/*.html', ['html'])
    gulp.watch('app/**/*.css', ['css'])
})


gulp.task('default', ['scripts', 'html', 'css','browser-sync', 'watch'])