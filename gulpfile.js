// https://www.sitepoint.com/simple-gulpy-workflow-sass/
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');

// Sass
var sass = require('gulp-sass');
  var cssinput = './src/sass/**/*.scss';
  var output = './dist/css'; // WP needs a root style.css for themes to work
  var autoprefixer = require('gulp-autoprefixer');
  var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
  };
  var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
  };

// JS
var uglify = require('gulp-uglify');
  var jsinput = './src/js/**/*.js';
  var pump = require('pump');
  var concat = require('gulp-concat');

var sourcemaps = require('gulp-sourcemaps');



gulp.task('sass', function () {
  return gulp
    .src(cssinput)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest(output));
});
  gulp.task('sassmin', function () {
    return gulp
      .src(cssinput)
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(autoprefixer(autoprefixerOptions))
      .pipe(gulp.dest(output));
  });

gulp.task('js', function() {
  // return gulp.src(['node_modules/jquery/dist/jquery.min.js', 'src/js/global.js'])
  return gulp.src(['src/js/global.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('global.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});
  gulp.task('jsmin', function (cb) {
    pump([
        gulp.src('src/js/*.js'),
        uglify(),
        gulp.dest('dist/js')
      ],
      cb
    );
  });

gulp.task('img', () =>
  gulp.src('src/img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'))
);

gulp.task('watch', function() {
  gulp.watch(jsinput, ['js'])
  return gulp
    .watch(cssinput, ['sass'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('browsersync', ['sass'], function() {
  browserSync.init({ proxy: "localhost/vcc" });
  gulp.watch(cssinput, ['sass']).on('change', browserSync.reload);
  gulp.watch(jsinput, ['js']).on('change', browserSync.reload);
  gulp.watch("*.php").on('change', browserSync.reload);
});


gulp.task('dev', [ 'browsersync' ]);
gulp.task('default', [ 'sassmin', 'img', 'jsmin' ]);
