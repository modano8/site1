/* gulpfile.js */
var
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat');

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

// default task
gulp.task('default', ['sass'], function() {
    gulp.watch(css.watch, ['sass']);
});