var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var browserSync = require('browser-sync').create();
var SSI = require('browsersync-ssi');
var imagemin = require('gulp-imagemin'); //压缩图片
var concat = require('gulp-concat');   // 合并js
var cleanCss = require('gulp-clean-css'); //压缩css
var minify = require('gulp-minify');
var cache = require('gulp-cache');
var plumber = require('gulp-plumber');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify'); // 压缩混淆js

var htmlmin = require('gulp-htmlmin'); //压缩html代码
var sass = require('gulp-sass');  // 编译sass
var zip = require('gulp-zip'); // 打包发布
var gutil = require('gulp-util');

//var uncss = require('gulp-uncss'); // 删除多余css  代码

var babel = require("gulp-babel"); // ES6 转 ES5

gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: ["./dist"],
			middleware: SSI({
				baseDir: './dist',
				ext: '.shtml',
				version: '2.10.0'
			})
		}
	});
	gulp.watch("sass/**/*.scss", ['sass']);
	gulp.watch("pages/**/*.html", ['html']);
	gulp.watch('img/**/*', ['images']);
	gulp.watch('js/**/*', ['js']);
	
	// mobile 手机
	gulp.watch('mobile/pages/**/*.html', ['mobileHtml']);
	gulp.watch('mobile/sass/**/*.scss', ['mobileSass']);
	gulp.watch('moible/img/**/*', ['mobileImages']);
	gulp.watch('moible/js/**/*', ['mobileJs']);
	
	gulp.watch("moilbe/pages/**/*.html").on("change", browserSync.reload);
//	gulp.watch("pages/**/*.html").on("change", browserSync.reload);
//	gulp.watch('css/**/*', ['uncss']);
	//	gulp.watch('dist/**/*', ['publish']);
});

gulp.task('sass', function() {
	return gulp.src("sass/**/*.scss")
		.pipe(plumber())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(sass({
			outputStyle: "compact"
		}))
		.pipe(cleanCss())
		.pipe(gulp.dest("dist/styles"))
		.pipe(browserSync.stream());
});
//gulp.task('uncss', function() {
//	return gulp.src(['css/**/**.css', '!css/lib/animate.min.css'])
//		.pipe(uncss({
//			html: ["dist/**/*.html"]
//		}))
//		.pipe(cleanCss())
//		.pipe(gulp.dest("dist/styles"))
//		.pipe(browserSync.stream());
//});

gulp.task('js', function() {
	return gulp.src(['js/**/*.js', '!js/lib/**/*.min.js', '!js/lib/**.*.js'])
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(plumber())
		.pipe(babel())
		.pipe(uglify())
		.on('error', function(err) {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
		})
		.pipe(gulp.dest('dist/scripts'))
		.pipe(browserSync.stream());
});

gulp.task('images', function() {
	return gulp.src('img/**/*')
		.pipe(cache(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
		.pipe(browserSync.stream());
});

gulp.task('html', function() {
	return gulp.src(['pages/**/*.html', '!pages/include/**.html'])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		//		.pipe(rename({
		//			suffix: 'min'
		//		}))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(plumber())
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
});

gulp.task('publish', function() {
	return gulp.src('dist/**/*')
		.pipe(plumber())
		.pipe(zip('publish.zip'))
		.pipe(gulp.dest('release'))
});

// mobile  手机
gulp.task('mobileHtml', function() {
	return gulp.src(['mobile/pages/**/*.html','mobile/pages/include/**.html'])
		//		.pipe(rename({
		//			suffix: 'min'
		//		}))
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(plumber())
		.pipe(gulp.dest('dist/mobile/'))
		.pipe(browserSync.stream());
});
gulp.task('mobileSass', function() {
	return gulp.src("mobile/sass/**/*.scss")
		.pipe(plumber())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(sass({
			outputStyle: "compact"
		}))
		.pipe(cleanCss())
		.pipe(gulp.dest("dist/mobile/styles"))
		.pipe(browserSync.stream());
});

gulp.task('mobileJs', function() {
	return gulp.src(['mobile/js/**/*.js'])
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(plumber())
		.pipe(babel())
		.pipe(uglify())
		.on('error', function(err) {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
		})
		.pipe(gulp.dest('dist/mobile/scripts'))
		.pipe(browserSync.stream());
});

gulp.task('mobileImages', function() {
	return gulp.src('mobile/img/**/*')
		.pipe(cache(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/mobile/images'))
		.pipe(browserSync.stream());
});

gulp.task('default', ['serve']);