﻿const gulp = require('gulp');
const gutil = require('gulp-util');
const packager = require('electron-packager')
const tsc = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const preprocess = require('gulp-preprocess');
const buffer = require('vinyl-buffer');
const merge = require('merge2');
const { spawn, exec, execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

const dirOutput = path.join(__dirname, 'dist');
const dirLicense = `${dirOutput}/license`;
const dirRelease = `${dirOutput}/release`;
const dirBuild = `${dirOutput}/build`;
const dirBuildNodes = `${dirBuild}/node_modules/node-red/nodes/custom`;
const dirSource = path.join(__dirname, 'src');
const dirSourceNodes = `${dirSource}/node_red_nodes`;

const commitId = execSync('git rev-parse HEAD').toString()

const packageJson = require(path.join(dirSource, 'package.json'));
const preprocessContext = { DEBUG: false, packageJson, commitId };
const licenseOptions = { directory: dirSource, production: true, depth: 0, summaryMode: 'detail' };

fs.ensureDirSync(dirOutput);

gulp.task('clean:release', () => fs.emptyDirSync(dirRelease));
gulp.task('clean:build', () => fs.emptyDirSync(dirBuild));
gulp.task('clean:license', () => fs.emptyDirSync(dirLicense));

gulp.task('start:debug', ['build:debug'], function () {
  const app = `${dirBuild}/main.js`
  gutil.log(gutil.colors.yellow(`starting debug: ${app}`));
  const env = Object.create(process.env);
  const proc = spawn('./node_modules/.bin/electron', [app], { env: env });
  proc.stdout.pipe(process.stdout)
  return proc;
});

gulp.task('start:release', ['release'], function () {
  const platform = require('os').platform()

  const app = (platform === 'darwin')
    ? `${dirRelease}/${packageJson.name}-${platform}-x64/${packageJson.name}.app/Contents/MacOS/${packageJson.name}`
    : `${dirRelease}/${packageJson.name}-${platform}-x64/flow-to-go.exe`;

  gutil.log(gutil.colors.yellow(`starting release: ${app}`));
  const proc = spawn(app);
  proc.stdout.pipe(process.stdout)
  return proc;
});

gulp.task('build:debug', function() {
  preprocessContext.DEBUG = true;
  gutil.log(gutil.colors.yellow('DEBUG BUILD') );
  return gulp.start('build');
});

gulp.task('build', ['clean:build'], function () {
  // build & copy application
  const copyApp = gulp.src([
    `${dirSource}/?(index.html|package.json)`
  ], { base: dirSource })
    .pipe(plumber())
    .pipe(preprocess({ context: preprocessContext }))  
    .pipe(gulp.dest(dirBuild));

  const copyModules = gulp.src([
    `${dirSource}/node_modules/**/*.*`,
    `!${dirSource}/node_modules/**/*.?(md|markdown|txt)`,
    `!${dirSource}/node_modules/**/test.js)`,
    `!${dirSource}/node_modules/node-red/nodes/core/hardware/**/*.*`,
  ], { base: dirSource })
    .pipe(gulp.dest(dirBuild));

  const tsAppProject = tsc.createProject('./tsconfig.json');
  tsAppProject.outDir = dirBuild;
  const transpileApp = gulp.src([
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
  const copyNodes = gulp.src([
    `${dirSourceNodes}/**/*.html`
  ], { base: dirSourceNodes })
    .pipe(plumber())
    .pipe(preprocess({ context: preprocessContext }))  
    .pipe(gulp.dest(dirBuildNodes));

  const tsNodesProject = tsc.createProject('./tsconfig.json');
  tsNodesProject.outDir = dirBuildNodes;
  const transpileNodes = gulp.src([
    `${dirSourceNodes}/**/*.ts`
  ]).pipe(plumber())
    .pipe(preprocess({ context: preprocessContext }))
    .pipe(sourcemaps.init())
    .pipe(tsNodesProject())
    .pipe(buffer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dirBuildNodes));

  return merge([copyApp, copyModules, copyNodes, transpileApp, transpileNodes]);
});

gulp.task('release', ['build', 'clean:release', 'license-info'], done => {
  const devPackageJson = require('./package.json');
  const electronVersion = `${/\d+.\d+.\d+/g.exec(devPackageJson.devDependencies.electron)}`;

  packager({
    dir: dirBuild,
    prune: true,
    cache: './cache',
    arch: 'x64',
    asar: true,
    electronVersion,
    icon: './app',
    out: dirRelease
  }, (err, appPaths) => {
    if (err) {
      throw new gutil.PluginError('electron-packager', err, { showStack: false })
    }
    appPaths.forEach(appPath => {
      fs.copySync(dirLicense, appPath);
    });
    done();
  });
});

gulp.task('license-info', ['clean:license'], callback => {
  const filename = path.join(dirLicense, 'LICENSES.THIRD.PARTY');

  exec(`yarn licenses generate-disclaimer > ${filename}`, { cwd: dirSource }, (error, stdout, stderr) => {
    if (error) { throw new gutil.PluginError('license-info', error) };
    callback();
  });
})