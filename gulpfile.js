var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
//    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
//    livereload = require('gulp-livereload'),
    //lr = require('tiny-lr'),
    path = require('path'),
    livereloadport = 35729,
    cheerio = require('gulp-cheerio'),
    fs = require('fs')
    ;

gulp.task('styles', function() {
  return gulp.src('src/style/main.less')
    .pipe(less())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({basename: 'style'}))
    .pipe(gulp.dest('style'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('style'))
    //.pipe(notify({ message: 'Styles task complete' }))
    ;
});

gulp.task('scripts', function() {
  return gulp.src(['src/lib/**/*.js', 'src/js/**/!(app)*.js', 'src/js/app.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    //.pipe(notify({ message: 'Scripts task complete' }))
    ;
});

gulp.task('html', function(){
  return gulp.src('src/index.html')
    .pipe(cheerio({
      run: function($, done){
        var els = $('[embed-src]');
        els.each(function(){
          var el = $(this);
          var srcFile = 'src/'+$(this).attr('embed-src');
          var src = fs.readFileSync(srcFile);
          el.removeAttr('embed-src');
          el.html(src);
        });
        done();
      }
    }))
    .pipe(gulp.dest('./'))
    //.pipe(notify({ message: 'HTML task complete' }))
    ;
});

gulp.task('vendor', function(){
  return gulp.src('src/vendor/**/*')
    .pipe(gulp.dest('vendor'))
    //.pipe(notify({ message: 'Vendor task complete' }))
    ;
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('images'))
    //.pipe(notify({ message: 'Images task complete' }))
    ;
});

gulp.task('clean', function() {
  return gulp.src(['style', 'js', 'partials', 'images', 'vendor', 'index.html'], {read: false})
    .pipe(clean());
});

gulp.task('watch', ['clean'], function() {
  // Watch .less files
  gulp.watch('src/style/**/*.less', ['styles']);
  // Watch .css files
  gulp.watch('src/style/**/*.css', ['styles']);
  // Watch .js files
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/lib/**/*.js', ['scripts']);
  // Watch image files
  gulp.watch('src/images/**/*', ['images']);
  // Watch the html files
  gulp.watch('src/**/*.html', ['html']);
  // Watch the vendor files
  gulp.watch('src/vendor/**/*', ['vendor']);

  gulp.start('styles', 'scripts', 'html', 'vendor', 'images');
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'vendor', 'html', 'images');
});