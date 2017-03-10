/* gulpfile.js */
var
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect');

// source and distribution folder
var
    source = 'src/',
    dest = 'dist/';

// Bootstrap scss source
var bootstrapSass = { in: './bower_components/bootstrap-sass/'
};

// fonts
var fonts = { in: [source + 'fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'],
    out: dest + 'fonts/'
};

// html
var html = { in: source + '*.html',
    out: dest,
    watch: source + '*.html'
};

// css source file: .scss files
var css = { in: source + 'css/main.scss',
    out: dest + 'css/',
    watch: source + 'css/**/*',
    add: source + 'css/bootstrap-custom.css',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets']
    }
};

// copy html to dest
gulp.task('html', function() {
    return gulp
        .src(html.in)
        .pipe(gulp.dest(html.out))
        .pipe(connect.reload());
});

// copy bootstrap required fonts to dest
gulp.task('fonts', function() {
    return gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out));
});

// copy additional css to dest
gulp.task('additional', function() {
    return gulp
        .src(css.add)
        .pipe(gulp.dest(css.out));
});

// compile scss
gulp.task('sass', ['fonts'], function() {
    return gulp.src([css.in, css.add])
        .pipe(sass(css.sassOpts))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(css.out));
});

// server connect
gulp.task('connect', function() {
    connect.server({
        root: [__dirname],
        livereload: true
    });
});

// default task
gulp.task('default', ['connect', 'sass', 'html'], function() {

    gulp.watch(css.watch, ['sass']);
    gulp.watch(html.watch, ['html']);
});