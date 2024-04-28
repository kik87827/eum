
var gulp = require("gulp"),
	fileinclude = require('gulp-file-include'),
	webserver = require('gulp-webserver'),
	connect = require('gulp-connect'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	scss = require('gulp-sass')(require('sass')),
	beautify = require('gulp-beautify'),
	htmlbeautify = require('gulp-html-beautify');

gulp.task('default', ['scss','fileinclude','beautify','watch']);

gulp.task('scss', function () {
	gulp.src('./src/assets/css/*.scss')
	.pipe(sourcemaps.init())
	.pipe(scss().on('error', scss.logError))
	.pipe(autoprefixer())
	//.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./dist/assets/css/'))
});

gulp.task('htmlbeautify', function () {
	var options = { indent_with_tabs : true }
	gulp.src('./src/**.html')
	.pipe(htmlbeautify(options))
	.pipe(gulp.dest('./dist/'))
});

gulp.task('connect', function() {
	connect.server({
	  root: 'dist',
	  port: 8001,
	  livereload: true
	});
  });


gulp.task('beautify',function(){
	gulp.src('./src/assets/js/*.js')
	.pipe(beautify.js({indent_size: 2}))
	.pipe(gulp.dest('./dist/assets/js/'))
});

gulp.task('fileinclude',function(){
	gulp.src(['./src/**.html'],{base : "./src/"})
	.pipe(fileinclude({
		prefix : '@@',
		basepath : '@file'
	}).on('error', function(data){ console.log(data)}))
	// .pipe(removeEmptyLines())
	.pipe(htmlbeautify({indent_with_tabs : true}))
	.pipe(gulp.dest('./dist/'))
});


gulp.task('watch', function () {
	gulp.watch(['./src/**.html', './src/*/**.html'], ["fileinclude"]);
	gulp.watch(['./src/assets/css/**/*.scss'], ["scss"]);
	gulp.watch(['./src/assets/js/*.js'], ["beautify"]);
});