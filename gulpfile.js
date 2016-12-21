const gulp = require('gulp');
const gutil = require('gulp-util');
const electron = require('gulp-electron');
const del = require('del');
const tsc = require('gulp-typescript');
const merge = require('merge2');
const spawn = require('child_process').spawn;
const packageMetadata = require('./package.json');
const electronVersion = `v${packageMetadata.devDependencies.electron}`;

const dirOutput = './dist'
const dirRelease = `${dirOutput}/release`
const dirBuild = `${dirOutput}/build`
const dirBuildNodes = `${dirBuild}/node_modules/node-red/nodes/custom`
const dirSource = './src'
const dirSourceNodes = `${dirSource}/node_red_nodes`

gulp.task('clean:release', function() {
    return del([dirRelease]);
});

gulp.task('clean:build', function() {
    return del([dirBuild]);
});

gulp.task('start:debug', ['build'], function () {
  gutil.log(gutil.colors.yellow('starting debug'));
  const env = Object.create( process.env );
  env.PLATFORM_TARGET = 'development';
  return spawn('electron', [`${dirBuild}/main.js`], { env: env });
});

gulp.task('start:darwin', ['release'], function () {
  gutil.log(gutil.colors.yellow('starting release'));
  return spawn(`${dirRelease}/${electronVersion}/darwin-x64/red-to-go.app/Contents/MacOS/Electron`);
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
  
  const tsAppProject = tsc.createProject("./tsconfig.json");
  tsAppProject.outDir = dirBuild;
  const transpile_app = gulp.src([
    `${dirSource}/**/*.?(ts|tsx)`,
    `!${dirSource}/node_modules/**`,
    `!${dirSourceNodes}/**`,
  ]).pipe(tsAppProject())
    .pipe(gulp.dest(dirBuild));
    
  // build & copy custom nodes
  const copy_nodes = gulp.src([
    `${dirSourceNodes}/**/*.html`
  ], { base: dirSourceNodes })
    .pipe(gulp.dest(dirBuildNodes));

  const tsNodesProject = tsc.createProject("./tsconfig.json");
  tsNodesProject.outDir = dirBuildNodes;
  const transpile_nodes = gulp.src([
    `${dirSourceNodes}/**/*.ts`
  ]).pipe(tsNodesProject())
    .pipe(gulp.dest(dirBuildNodes));
  
  return merge([copy_app, copy_nodes, transpile_app, transpile_nodes]);
});

gulp.task('release', ['build', 'clean:release'], function() {
    return gulp.src("")
        .pipe(electron({
            src: dirBuild,
            packageJson: require(`${dirBuild}/package.json`),
            release: dirRelease,
            cache: './cache',
            version: electronVersion,
            packaging: false,
            asar: true,
            platforms: ['darwin-x64']
        }))
        .pipe(gulp.dest(""));
});