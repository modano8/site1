/* gulpfile.js */
var
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    htmlreplace = require('gulp-html-replace'),
    inject = require('gulp-inject');

// source and distribution folder
var
    source = 'src/',
    dest = 'dist/',
    build = 'build/';

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
    watch: source + '*.html',
    partials: source + 'partials/**/*.html'
};

var replace = {
        css: '<!--MS:<SharePoint:CssRegistration Name="Themable/corev15.css" runat="server">-->' +
         '<!--ME:</SharePoint:CssRegistration>-->'
}

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
    },
    build: build + 'css/'
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

// compile scss to build
gulp.task('sass-build', ['fonts'], function() {
    return gulp.src([css.in, css.add])
        .pipe(sass(css.sassOpts))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(css.build));
});

// inject and copy html
gulp.task('inject', function () {
   return  gulp.src(html.in)
           .pipe(inject(gulp.src([html.partials]), {
               starttag: '<!-- inject:{{path}} -->',
               relative: true,
               removeTags: true,
               transform: function (filePath, file) {
                   // return file contents as string 
                   return file.contents.toString('utf8')
               }
           }))
           .pipe(gulp.dest(html.out));
});

// build 
gulp.task('build', ['sass-build'], function() {
     return gulp.src(html.in)
            .pipe(inject(gulp.src([html.partials]), {
                 starttag: '<!-- inject:{{path}} -->',
                 relative: true,
                 removeTags: true,
                 transform: function (filePath, file) {
                     // return file contents as string 
                     return file.contents.toString('utf8')
                 }
             }))
            .pipe(htmlreplace({
                'css': replace.css
            }))
            .pipe(gulp.dest(build));
});

// server connect
gulp.task('connect', function() {
    connect.server({
        root: ['dist/'],
        livereload: true
    });
});

// default task
gulp.task('default', ['connect', 'sass', 'inject'], function() {
    gulp.watch(css.watch, ['sass']);
    gulp.watch(html.watch, ['inject']);
});