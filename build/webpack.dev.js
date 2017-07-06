const path = require('path');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

const rootDir = path.resolve(__dirname, '..');
const outputDir = path.resolve(rootDir, 'dist');

module.exports = Merge(CommonConfig, {
  devtool: 'source-map',
  plugins: [
  ]
});
