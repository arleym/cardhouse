// Card House Runner
var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// Media
var imginput = 'src/img/**'
const imagemin = require('gulp-imagemin');

// Sass
var sass = require('gulp-sass');
  var cssinput = './src/sass/**/*.scss';
  var cssoutput = './dist/css';
  var autoprefixer = require('gulp-autoprefixer');
  var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
  };
  var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
  };

// JS
var jsinput = ['node_modules/jquery/dist/jquery.min.js', './src/js/**/*.js'];
  var jsoutput = 'dist/js'
  var uglify = require('gulp-uglify');
  var rename = require('gulp-rename');
  var concat = require('gulp-concat');

var sourcemaps = require('gulp-sourcemaps');



gulp.task('sass', function () {
  return gulp
    .src(cssinput)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest(cssoutput));
});
  gulp.task('sassmin', function () {
    return gulp
      .src(cssinput)
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(autoprefixer(autoprefixerOptions))
      .pipe(gulp.dest(cssoutput));
  });

gulp.task('js', function() {
  return gulp.src(jsinput)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(jsoutput));
});
  gulp.task('jsmin', function () {
    return gulp.src(jsinput)
      .pipe(concat('main.js'))
      .pipe(gulp.dest(jsoutput))
      .pipe(rename('main.js'))
      .pipe(uglify())
      .pipe(gulp.dest(jsoutput));
  });

gulp.task('img', () =>
  gulp.src('src/img/**')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'))
);

gulp.task('watch', function() {
  gulp.watch(jsinput, ['js'])
  gulp.watch(imginput, ['img'])
  return gulp
    .watch(cssinput, ['sass'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('browsersync', ['sass'], function() {
  browserSync.init({ server: {baseDir: "./"} });
  gulp.watch(cssinput, ['sass']).on('change', browserSync.reload);
  gulp.watch(jsinput, ['js']).on('change', browserSync.reload);
  gulp.watch("*.html").on('change', browserSync.reload);
  gulp.watch(imginput, ['img']).on('change', browserSync.reload);
});


gulp.task('dev', [ 'sass', 'js', 'img', 'browsersync' ]);
gulp.task('default', [ 'sassmin', 'img', 'jsmin' ]);
