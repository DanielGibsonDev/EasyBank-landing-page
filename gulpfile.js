'use strict';

const 
  // modules
  { src, dest, watch, series, parallel } = require('gulp'),

  glp = require('gulp-load-plugins')(),
  sass = require('gulp-sass'),
  postcssPresetEnv = require('postcss-preset-env'),
  postcssNormalize = require('postcss-normalize'),
  cssnano = require('cssnano'),
  del = require('del'),
  argv = require('yargs').argv,
  browserSync = require('browser-sync').create(),

  production = !!argv.production,

  // folders
  paths = {
    html: {
      src: './src/*.html',
      dest: './build'
    },
    scss: {
      src: './src/scss/**/*.scss',
      dest: './build/css'
    },
    js: {
      src: '/src/js/**/*.js',
      dest: './build/js'
    },
    images: {
      src: './src/images/*.*',
      dest: './build/images'
    }
  }
  ;


// Clear build folder
function clean() {
  return del(['./build/*']);
}


// image processing
function imagesTask() {
  return src(paths.images.src)
    .pipe(dest(paths.images.dest))
    .on('end', browserSync.reload);
};


// HTML processing
function htmlTask() {
  return src(paths.html.src)
    .pipe(glp.if(production, glp.removeEmptyLines({
      removeComments: true
    })))
    .pipe(glp.if(production, glp.replace('.css', '.min.css')))
    .pipe(glp.if(production, glp.replace('scripts.js', 'scripts.min.js')))
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}


// JavaScript processing
function jsTask() {
  return src(paths.js.src, {
    allowEmpty: true
    })
    .pipe(glp.sourcemaps.init())
    .pipe(glp.babel({
      presets: ['@babel/env']
    }))
    .pipe(glp.if(production, glp.uglify()))
    .pipe(glp.if(production, glp.rename({
      suffix: '.min'
    })))
    .pipe(glp.sourcemaps.write('./'))
    .pipe(dest(paths.js.dest))
    .on('end', browserSync.reload);
}


// CSS processing
function scssTask() {
  let postcssPlugins = [
    postcssNormalize(),
    postcssPresetEnv({
      autoprefixer: { grid: true }
    })
  ];

  if (production) postcssPlugins.push(cssnano());

  return src(paths.scss.src)
    .pipe(glp.sourcemaps.init())
    .pipe(glp.sass({
      includePaths: ['node_modules']
    }))
    .pipe(glp.postcss(postcssPlugins))
    .pipe(glp.if(production, glp.rename({
      suffix: '.min'
    })))
    .pipe(glp.sourcemaps.write('./'))
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());
}


// Watch Tasks
function watchTask() {
  watch(paths.html.src, htmlTask);
  watch(paths.scss.src, scssTask);
  watch(paths.js.src, jsTask);
  watch(paths.images.src, imagesTask);
}


// BrowserSync initialization 
function syncTask() {
  browserSync.init({
    server: {
      baseDir: './build'
    },
  })
}


exports.default = series(clean,
  parallel(
    htmlTask, scssTask, jsTask, imagesTask
  ),
  parallel(watchTask, syncTask)
);


exports.prod = series(clean,
  series(
    htmlTask, scssTask, jsTask, imagesTask
  )
);