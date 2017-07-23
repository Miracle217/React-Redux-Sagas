var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var EventEmitter = require('events').EventEmitter;
var watchify = require('watchify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var rm = require('gulp-rimraf');
var shell = require('gulp-shell');
var glob = require('glob');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var fs = require('fs');
var s3 = require("gulp-s3");
var path = require('path');
var pug = require('gulp-pug');
var rename = require('gulp-rename');
var git = require('git-rev-sync');
var mkdirp = require('mkdirp');
var dateFormat = require('dateformat');
var sourcemaps = require('gulp-sourcemaps');
var Slack = require('node-slack');
var slack = new Slack("https://hooks.slack.com/services/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");

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var browserifyTask = function(options) {

  // Our app bundler
  var appBundler = browserify({
    entries: [options.src], // Only need initial file, browserify finds the rest
    transform: [
      [
        "babelify", {
          "presets": ["es2015", "react", "stage-0"],
        },
        'loose-envify'
      ]
    ], // We want to convert JSX to normal javascript
    debug: options.development, // Gives us sourcemapping
    cache: {},
    packageCache: {},
    paths: [path.dirname(options.src)],
    fullPaths: options.development // Requirement of watchify
  });

  // The rebundle process
  var rebundle = function() {
    var start = Date.now();
    console.log('Building APP bundle');
    return appBundler.bundle()
      .on('error', logError)
      .pipe(source(path.basename(options.src)))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(gulpif(options.development, livereload()))
      .pipe(notify(function() {
        console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
      }));
  };

  // Fire up Watchify when developing
  if (options.development) {
    appBundler = watchify(appBundler);
    appBundler.on('update', rebundle);
  }

  return rebundle();
}

var cssTask = function(options) {
  if (options.development) {
    var run = function() {
      console.log(arguments);
      var start = new Date();
      console.log('Building CSS bundle');
      return gulp.src(options.src)
        .pipe(gulpif(options.development, sourcemaps.init()))
        .pipe(sass(options.sass).on('error', sass.logError))
        .pipe(gulpif(options.development, sourcemaps.write()))
        .pipe(gulp.dest(options.dest))
        .pipe(livereload())
        .pipe(notify(function() {
          console.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
        }));
    };
    gulp.watch('./styles/**/*.scss', run);
    return run();
  }
  else {
    return gulp.src(options.src)
      .pipe(sass(options.sass).on('error', sass.logError))
      .pipe(cssmin())
      .pipe(gulp.dest(options.dest));
  }
}


var imagesTask = function(options) {
  if (options.development) {
    var run = function() {
      var start = new Date();
      console.log('Bundling Images');
      return gulp.src(options.src)
        .pipe((imagemin({ optimizationLevel: 3, progressive: true, interlaced: true , verbose: true})))
        .pipe(gulp.dest(options.dest));
    };
    gulp.watch(options.src, run);
    return run();
  } else {
    return gulp.src(options.src, {buffer: true})
      .pipe((imagemin({ optimizationLevel: 3, progressive: true, interlaced: true , verbose: true})))
      .pipe(gulp.dest(options.dest));
  }
}

var PAGES = [
  'index.html',
  'about.html',
  'signup.html',
  'contact.html',
  'legal.html',
  'privacy.html',
  'dashboard.html',
  'buying.html',
  'instagramAuthCallback.html',
  'twitterAuthCallback.html',
  'forgotPassword.html',
  'receipt.html',
  'verifyEmail.html',
  'emailLogin.html'
];


var pagesTask = function(options) {
  var locals = {
    env: options.development ? 'development' : 'production', // really just whether to use livereload or not
    environment: process.env.NODE_ENV // REAL environment
  };
  pageBundler = () => {
    const promises = PAGES.map(page => {
      return new Promise(resolve => {
        gulp.src(options.src)
          .pipe(pug({locals: locals, pretty: options.development}))
          .pipe(rename(page))
          .pipe(gulpif(options.development, livereload()))
          .pipe(gulp.dest(options.dest))
          .on('end', resolve);
      });
    });
    return Promise.all(promises);
  }
  if (options.development) {
    gulp.watch(options.src, pageBundler)
  }
  return pageBundler();
}

var fontsTask = function(options) {
  return gulp.src(options.src)
    .pipe(gulp.dest(options.dest));
}

var copyTask = function(options) {
  return gulp.src(options.src)
    .pipe(gulp.dest(options.dest));
}

var logError = function (err) {
  gutil.log(gutil.colors.red(err.message));
}

// Starts our development workflow
gulp.task('default', ['copy-config'], function(cb) {
  livereload.listen();

  connect.server({
    fallback: './build/index.html',
    root: 'build/',
    port: 8889
  });

  return Promise.all([
    promisifyStream(browserifyTask({
      development: true,
      src: './src/main.js',
      dest: './build'
    })),
    promisifyStream(browserifyTask({
      development: true,
      src: './src/vendors.js',
      dest: './build'
    })),
    promisifyStream(cssTask({
      development: true,
      src: './styles/main.scss',
      dest: './build/css',
      sass: {
        includePaths: [
          './node_modules/foundation-sites/scss'
        ]
      }
    })),
    promisifyStream(imagesTask({
      development: true,
      src: './images/*.png',
      dest: './build/images'
    })),
    promisifyStream(imagesTask({
      development: true,
      src: './images/*.svg',
      dest: './build/images'
    })),
    promisifyStream(fontsTask({
      development: true,
      src: './fonts/**',
      dest: './build/fonts'
    })),
    promisifyStream(copyTask({
      development: true,
      src: ['./public/**/*', './public/.**/*'],
      dest: './build/'
    })),
    pagesTask({ // already a promise
      development: true,
      src: './pages/index.pug',
      dest: './build/'
    })
  ]).then(cb);
});

gulp.task('compile', ['copy-config'], function(cb) {

  return Promise.all([
    promisifyStream(browserifyTask({
      development: false,
      src: './src/main.js',
      dest: './dist/' + process.env.NODE_ENV
    })),
    promisifyStream(browserifyTask({
      development: false,
      src: './src/vendors.js',
      dest: './dist/' + process.env.NODE_ENV
    })),
    promisifyStream(cssTask({
      development: false,
      src: './styles/main.scss',
      dest: './dist/' + process.env.NODE_ENV + '/css',
      sass: {
        includePaths: [
          './node_modules/foundation-sites/scss'
        ]
      }
    })),
    promisifyStream(imagesTask({
      development: false,
      src: './images/*.png',
      dest: './dist/' + process.env.NODE_ENV + '/images'
    })),
    promisifyStream(imagesTask({
      development: false,
      src: './images/*.svg',
      dest: './dist/' + process.env.NODE_ENV + '/images'
    })),
    promisifyStream(fontsTask({
      development: false,
      src: './fonts/**',
      dest: './dist/' + process.env.NODE_ENV + '/fonts'
    })),
    promisifyStream(copyTask({
      development: false, 
      src: ['./public/**/*', './public/.**/*'],
      dest: './dist/' + process.env.NODE_ENV
    })),
    pagesTask({
      development: false,
      src: './pages/index.pug',
      dest: './dist/' + process.env.NODE_ENV
    })
  ]).then(cb);
});

/**
* Uses the .aws.json and config/buckets.json files to push the
* dist/ to the proper S3 bucket
*/
gulp.task('deploy', function() {
  var buckets = JSON.parse(fs.readFileSync("./config/buckets.json"));
  var aws = JSON.parse(fs.readFileSync("./.aws.json"));
  aws['bucket'] = buckets[process.env.NODE_ENV] || 'web.dev.boo.st';
  gulp.src('./dist/**').pipe(s3(aws));
});

/**
* Workaround to allow for environment based configuration
* NOTE: src/config.js is not committed to the Repo
*/
gulp.task('copy-config', function() {
  var environment = process.env.NODE_ENV || 'development'
  var file = 'config/' + environment + '.config.js'
  console.log('Copying config: ' + file + ' -> src/config.js');
  fs.createReadStream(file).pipe(fs.createWriteStream('src/config.js'));
});

/**
* Destroy previous dist build
*/
gulp.task('clean', function() {
  gulp.src('dist/*').pipe(rm());
});

function promisifyStream (stream) {
  return new Promise(resolve => {
    stream.on('end', resolve);
  });
}
