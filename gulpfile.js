const gulp = require('gulp');
const gutil = require('gulp-util');
const electron = require('gulp-electron');
const del = require('del');
const tsc = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const preprocess = require('gulp-preprocess');
const buffer = require('vinyl-buffer');
const merge = require('merge2');
const spawn = require('child_process').spawn;
const platform = require('os').platform();
const path = require('path');
const packageMetadata = require('./package.json');

const electronVersion = `v${/\d+.\d+.\d+/g.exec(packageMetadata.devDependencies.electron)}`;

const dirOutput = './dist'
const dirRelease = `${dirOutput}/release`
const dirBuild = `${dirOutput}/build`
const dirBuildNodes = `${dirBuild}/node_modules/node-red/nodes/custom`
const dirSource = './src'
const dirSourceNodes = `${dirSource}/node_red_nodes`

const app = getAppPath(platform);
const preprocessContext = { DEBUG: false };

gulp.task('clean:release', function () {
  return del([dirRelease]);
});

gulp.task('clean:build', function () {
  return del([dirBuild]);
});

gulp.task('start:debug', ['build:debug'], function () {
  const app = `${dirBuild}/main.js`
  gutil.log(gutil.colors.yellow(`starting debug: ${app}`));
  const env = Object.create(process.env);
  const proc = spawn('./node_modules/.bin/electron', [app], { env: env });
  proc.stdout.pipe(process.stdout)
  return proc;
});

gulp.task('start:release', ['release'], function () {
  gutil.log(gutil.colors.yellow(`starting release: ${app}`));
  const proc = spawn(app);
  proc.stdout.pipe(process.stdout)
  return proc;
});

gulp.task('build:debug', function() {
  preprocessContext.DEBUG = true;
  gutil.log(gutil.colors.yellow('DEBUG BUILD') );
  // return gulp.tasks.build.fn();
  return gulp.start('build');
});

gulp.task('build', ['clean:build'], function () {
  gutil.log(gutil.colors.yellow(`electron: ${electronVersion}`));
  // build & copy application
  const copy_app = gulp.src([
    `${dirSource}/node_modules/**/*.*`,
    `!${dirSource}/node_modules/**/*.?(md|markdown|txt)`,
    `!${dirSource}/node_modules/**/test.js)`,
    `!${dirSource}/node_modules/node-red/nodes/core/hardware/**/*.*`,
    `${dirSource}/?(index.html|package.json)`
  ], { base: dirSource })
    .pipe(gulp.dest(dirBuild));

  const tsAppProject = tsc.createProject('./tsconfig.json');
  tsAppProject.outDir = dirBuild;
  const transpile_app = gulp.src([
    `${dirSource}/**/*.?(ts|tsx)`,
    `!${dirSource}/node_modules/**`,
    `!${dirSourceNodes}/**`,
  ]).pipe(plumber())
    .pipe(preprocess({ context: preprocessContext }))
    .pipe(sourcemaps.init())
    .pipe(tsAppProject())
    .pipe(buffer())
    .pipe(sourcemaps.write('.', {
      includeContent: false,
      sourceRoot: path.relative(dirBuild, dirSource)
    }))
    .pipe(gulp.dest(dirBuild));

  // build & copy custom nodes
  const copy_nodes = gulp.src([
    `${dirSourceNodes}/**/*.html`
  ], { base: dirSourceNodes })
    .pipe(gulp.dest(dirBuildNodes));

  const tsNodesProject = tsc.createProject('./tsconfig.json');
  tsNodesProject.outDir = dirBuildNodes;
  const transpile_nodes = gulp.src([
    `${dirSourceNodes}/**/*.ts`
  ]).pipe(plumber())
    .pipe(preprocess({ context: preprocessContext }))
    .pipe(sourcemaps.init())
    .pipe(tsNodesProject())
    .pipe(buffer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dirBuildNodes));

  return merge([copy_app, copy_nodes, transpile_app, transpile_nodes]);
});

gulp.task('release', ['build', 'clean:release'], function () {
  return gulp.src('')
    .pipe(plumber())
    .pipe(electron({
      src: dirBuild,
      packageJson: require(`${dirBuild}/package.json`),
      release: dirRelease,
      cache: './cache',
      version: electronVersion,
      packaging: false,
      asar: true,
      platforms: [`${platform}-x64`]
    }))
    .pipe(gulp.dest(''));
});

function getAppPath(platform) {
  switch (platform) {
    case 'darwin': return `${dirRelease}/${electronVersion}/darwin-x64/red-to-go.app/Contents/MacOS/Electron`;
    case 'win32': return `${dirRelease}/${electronVersion}/win32-x64/red-to-go.exe`;
  }
}
