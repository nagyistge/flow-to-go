const gulp = require('gulp');
const gutil = require('gulp-util');
const packager = require('electron-packager')
const del = require('del');
const tsc = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const preprocess = require('gulp-preprocess');
const buffer = require('vinyl-buffer');
const merge = require('merge2');
const spawn = require('child_process').spawn;
const path = require('path');
const licenseFinder = require('nlf');
const fs = require('fs');

const dirOutput = path.join(__dirname, 'dist');
const dirLicense = `${dirOutput}/license`;
const dirRelease = `${dirOutput}/release`;
const dirBuild = `${dirOutput}/build`;
const dirBuildNodes = `${dirBuild}/node_modules/node-red/nodes/custom`;
const dirSource = path.join(__dirname, 'src');
const dirSourceNodes = `${dirSource}/node_red_nodes`;

const preprocessContext = { DEBUG: false };
const licenseOptions = { directory: dirSource, production: true, depth: 0, summaryMode: 'detail' };

if (!fs.existsSync(dirOutput)) { fs.mkdirSync(dirOutput); }

gulp.task('clean:release', () => del([dirRelease]).then(() => fs.mkdirSync(dirRelease)));
gulp.task('clean:build', () => del([dirBuild]).then(() => fs.mkdirSync(dirBuild)))
gulp.task('clean:license', () => del([dirLicense]).then(() => fs.mkdirSync(dirLicense)))

gulp.task('start:debug', ['build:debug'], function () {
  const app = `${dirBuild}/main.js`
  gutil.log(gutil.colors.yellow(`starting debug: ${app}`));
  const env = Object.create(process.env);
  const proc = spawn('./node_modules/.bin/electron', [app], { env: env });
  proc.stdout.pipe(process.stdout)
  return proc;
});

gulp.task('start:release', ['release'], function () {
  const packageJson = require(path.join(dirSource, 'package.json'));
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

gulp.task('release', ['build', 'clean:release', 'license-info'], done => {
  packager({
    dir: dirBuild,
    prune: true,
    cache: './cache',
    arch: 'x64',
    asar: true,
    icon: './app',
    out: dirRelease
  }, (err, appPaths) => {
    if (err) {
      throw new gutil.PluginError('electron-packager', err, { showStack: false })
    }
    done();
  });
});

gulp.task('license-info', ['clean:license'], callback => {
  const filename = path.join(dirLicense, 'license-info.txt');
  
  licenseFinder.find(licenseOptions, (err, data) => {
    if (err) { throw new gutil.PluginError('licenseFinder', err, { showStack: true }) };
    
    licenseFinder.standardFormatter.render(data, licenseOptions, (err, output) => {
      if (err) { throw new gutil.PluginError('licenseFinder', err, { showStack: true }) };
      
      fs.writeFile(filename, output, err => {
        if (err) { throw new gutil.PluginError('licenseFinder', err, { showStack: true }) };
        callback();
      })
    });
  });
})
