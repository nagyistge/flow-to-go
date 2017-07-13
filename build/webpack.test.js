const path = require('path');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.resolve(rootDir, 'src');
const glob = require('glob');

const tests = glob
  .sync(path.join(srcDir, '**', '*.spec.ts'))
  .reduce((result, fileName) => {
    result[path.basename(fileName).slice(0, -3)] = fileName
    return result;
  }, {});

module.exports = Merge(CommonConfig, {
  entry: tests,
  devtool: 'source-map',
  plugins: [
  ]
});
