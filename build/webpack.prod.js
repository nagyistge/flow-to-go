const path = require('path');
const { execSync } = require('child_process');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ElectronPackager = require('webpack-electron-packager');
const CommonConfig = require('./webpack.common.js');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.resolve(rootDir, 'src');
const outputDir = path.resolve(rootDir, 'dist');
const cacheDir = path.resolve(rootDir, '.cache');
const packageJson = require(path.join(rootDir, 'package.json'));
const electronVersion = `${/\d+.\d+.\d+/g.exec(packageJson.devDependencies.electron)}`;
const commitId = execSync('git rev-parse HEAD').toString()

module.exports = Merge(CommonConfig, {
  plugins: [
    new CleanWebpackPlugin([
      outputDir
    ], {
      root: rootDir,
      exclude: [],
      verbose: true,
      dry: false
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
      'COMMIT': commitId
    }),
    new ElectronPackager({
      dir: outputDir,
      download: {
        cache: cacheDir,
      },
      prune: false,
      overwrite: true,
      arch: 'x64',
      asar: true,
      platform: 'darwin',
      packageManager: 'yarn',
      prune: true,
      tmpdir: false,
      electronVersion,
      icon: path.join(rootDir, 'icons', 'app'),
      out: path.join(outputDir, 'release')
    })
  ]
});
