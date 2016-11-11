const gulp = require('gulp');
const electron = require('gulp-electron');
const del = require('del');
var tsc = require('gulp-typescript');
var merge = require('merge2');

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

gulp.task('build', ['clean:build'], function () {

    // build & copy application
    const copy_app = gulp.src([
      `${dirSource}/node_modules/**/*.*`,
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
  
  return merge([copy_app,copy_nodes,transpile_app,transpile_nodes]);
});

gulp.task('release', ['build', 'clean:release'], function() {
    return gulp.src("")
        .pipe(electron({
            src: dirBuild,
            packageJson: require(`${dirBuild}/package.json`),
            release: dirRelease,
            cache: './cache',
            version: 'v1.4.6',
            packaging: false,
            asar: true,
            platforms: ['darwin-x64']
        }))
        .pipe(gulp.dest(""));
});