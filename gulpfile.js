"use strict";

/*jslint node: true */

var gulp         = require('gulp');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var merge = require('merge-stream');


var sass         = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleancss    = require('gulp-clean-css');
var rename       = require('gulp-rename');
var clean        = require('gulp-clean');
var jshint       = require('gulp-jshint');
var concat       = require('gulp-concat');
var imagemin     = require('gulp-imagemin');
var uglify       = require('gulp-uglify');
var cache        = require('gulp-cache');
var jade         = require('gulp-jade');
var prettify     = require('gulp-html-prettify');

var livereload   = require('gulp-livereload');
var webserver    = require('gulp-webserver');

var paths = {
	src  : './src',
	dest : './dist'
};

var COPY_FILES = [
	paths.src + '/css/*.css',
	paths.src + '/CNAME',
	paths.src + '/favicon*.*',
	paths.src + '/apple-touch-icon*.*',
	paths.src + '/fonts/*.*'
];

gulp.task('styles', function(){
	return sass(paths.src + '/css/**/*.scss', {
			style: 'expanded'
		})
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest( paths.src + '/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(cleancss())
		.pipe(gulp.dest( paths.dest + '/css'))
		.pipe(livereload());
});

gulp.task('lintscripts', function(){
	return gulp.src([
			'gulpfile.js',
			paths.src + '/js/**/*.js',
			'!' + paths.src + '/js/vendor/*'
		])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(livereload());
});

// OLD VERSION OF scripts using factor-bundle
// (see http://stackoverflow.com/a/23795802/2548559)

// packages up dependencies from main.js and web.js into common.js,
// browserifies main.js and web.js (not desktop because it will
// already have node and browserifying just throws errors)
// var browserify_scripts = browserify({
//   entries: [paths.src + '/js/main.js', paths.src + '/js/web.js'],
//   debug: true
// }).plugin(factor, {
// 			// File output order must match entry order
// 			o: [paths.dest + '/js/main.js', paths.dest + '/js/web.js']
// 	})
// 	.bundle()
//   .pipe(source('common.js'))
//   .pipe(buffer())
//   //.pipe(sourcemaps.init({loadMaps: true}))
//       // Add transformation tasks to the pipeline here.
//       //.pipe(uglify())
//       .on('error', gutil.log);
//   //.pipe(sourcemaps.write('./'));

gulp.task('scripts', ['lintscripts'], function(){
	// set up the browserify instance on a task basis
  var browserify_scripts = browserify({
    entries: [paths.src + '/js/main.js'],
    debug: true //,
		// ignoreMissing: true, // for electron
		// detectGlobals: false // for electron
  }).bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    //.pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        //.pipe(uglify())
        .on('error', gutil.log);
    //.pipe(sourcemaps.write('./'));

	var electron_scripts = gulp.src(paths.src + '/js/desktop.js');

	return merge(browserify_scripts, electron_scripts)
    .pipe(gulp.dest(paths.dest + '/js'))
		.pipe(livereload());
});

gulp.task('images', function(){
	return gulp.src([
			paths.src + '/img/**/*.png',
			paths.src + '/img/**/*.jpg',
			paths.src + '/img/**/*.gif'
		])
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest( paths.dest + '/img'))
		.pipe(livereload());
});

gulp.task('jade', function(){
	return gulp.src(paths.src + '/**/*.jade')
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(paths.src))
		.pipe(livereload());
});

gulp.task('markup', [ 'jade' ], function(){
	return gulp.src(paths.src + '/**/*.html')
		.pipe(prettify({
			indent_char: ' ', indent_size: 2
		}))
		.pipe(gulp.dest(paths.dest))
		.pipe(livereload());
});

gulp.task('copy', function() {
	return gulp.src(COPY_FILES, {
		base: paths.src // src will be stripped, other subdirectories retained
	})
		.pipe(gulp.dest(paths.dest))
		.pipe(livereload());
});

gulp.task('clean', function(){
	return gulp.src( paths.dest + '/' , {read: false})
		.pipe(clean())
		.pipe(livereload());
});

gulp.task('default', ['clean'] , function(){
	// ignore deprecation warning — Gulp actually doesn't have an easy way to do
	// this without gulp.run, so I'm using it anyway until 4.0 (for a description
	// of the problem and a solution that still doesn't work quite how I need it,
	// see https://www.npmjs.com/package/run-sequence)
	gulp.run('markup', 'styles', 'scripts', 'images', 'copy');
});

gulp.task('serve', function() {

	livereload.listen();

	gulp.src('dist')
    .pipe(webserver({ port: 4000 }));

	// Watch html files
	gulp.watch(paths.src + '/**/*.html', function() {
		gulp.run('markup');
	});

	// Watch jade files
	gulp.watch(paths.src + '/**/*.jade', function() {
		gulp.run('jade');
		gulp.run('markup');
	});

	// Watch image files
	gulp.watch(paths.src + '/img/*', function() {
		gulp.run('images');
	});

	// Watch .scss files
	gulp.watch([
			paths.src + '/scss/**/*.scss',
			paths.src + '/css/**/*.css',
		], function() {
		gulp.run('styles');
	});

	// Watch .js files
	gulp.watch([
			paths.src + '/js/**/*.js',
			paths.src + '/js/**/*.coffee',
		], function() {
		gulp.run('scripts');
	});

	// Watch images
	gulp.watch(paths.src + '/img/**/*', function() {
		gulp.run('images');
	});

	gulp.watch(COPY_FILES, function() {
		gulp.run('copy');
	});

});

/* DEPLOY */

// var deploy = require("gulp-gh-pages");
// var options = {
//     remoteUrl: "https://github.com/jacksondc/fog.git",
//     branch: "master"
// };
//
// gulp.task('deploy', function () {
//     gulp.src(["public/**/*.*", "public/CNAME"]) //a hack - see https://github.com/rowoot/gulp-gh-pages/issues/26
//         .pipe(deploy(options));
// });
