var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    path = require('path'),
    livereloadport = 35729,
    gcheerio = require('gulp-cheerio'),
    cheerio = require('cheerio'),
    webserver = require('gulp-webserver'),
    async = require('async'),
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
    ;
});

gulp.task('scripts', function() {
  return gulp.src(['src/lib/**/*.js', 'src/js/**/!(app)*.js', 'src/js/app.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    ;
});

gulp.task('html', function(){
  var doReplaceEmbeds = function($, done){
    var els = $('[embed-src]');
    async.each(els, function reformEmbed(elem, next){
      var el = $(elem);
      var srcFile = 'src/'+el.attr('embed-src');
      var src = fs.readFile(srcFile, function loadSource(err, src){
        if(err){
          console.error(err);
          src = 'File not found: '+srcFile;
        }
        el.removeAttr('embed-src');
        replaceEmbeds(src.toString(), function(err, src){
          el.html(src);
          next();
        });
      });
    }, function(){
      done(null, $.html());
    });
  };
  var replaceEmbeds = function replaceEmbeds(src, done){
    // TODO: Implement a proper recursive embedder and use it
    var $ = cheerio.load(src);
    doReplaceEmbeds($, done);
  };
  return gulp.src('src/index.html')
    .pipe(gcheerio({
      cheerio: cheerio,
      run: function($, done){
        doReplaceEmbeds($, function globalReplace(err, src){
          done();
        });
      }
    }))
    .pipe(gulp.dest('./'))
    ;
});

gulp.task('vendor', function(){
  return gulp.src('src/vendor/**/*')
    .pipe(gulp.dest('vendor'))
    ;
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest('images'))
    ;
});

gulp.task('clean', function() {
  return gulp.src(['style', 'js', 'partials', 'images', 'vendor', 'index.html'], {read: false})
    .pipe(clean());
});

gulp.task('serve', function(){
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      fallback: 'index.html',
      filter: function(filename){
        if(filename.match(/^(node_modules|src)/)){
          return false;
        }
        return true;
      },
      open: false
    }));
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

gulp.task('dev', ['watch'], function(){
  gulp.start('serve');
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'vendor', 'html', 'images');
});