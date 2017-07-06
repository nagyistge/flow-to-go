const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader')

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.resolve(rootDir, 'src');
const outputDir = path.resolve(rootDir, 'dist');

const embeddedPackages = Object
  .keys(require(path.join(srcDir, 'package.json')).dependencies)
  .map(package => {
    const result = {};
    result[package] = `commonjs ${package}`;
    return result;
  });

module.exports = {
  entry: {
    'electron': path.join(srcDir, 'main', 'electron.ts'),
    'app': path.join(srcDir, 'renderer', 'app.tsx'),
    'preload': path.join(srcDir, 'renderer', 'components', 'Preload.ts'),
  },
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    path: outputDir
  },
  stats: {
    warnings: false,
    assets: false,
    colors: true,
    entrypoints: true,
    chunks: false,
    children: false,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [srcDir, 'node_modules']
  },
  target: 'electron',
  externals: embeddedPackages,
  node: {
    __dirname: false,
    __filename: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/\.(spec|e2e)\.tsx?$/],
        use: [
          'awesome-typescript-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'app.html',
      template: path.join(srcDir, 'renderer', 'app.ejs'),
      chunks: ['app'],
      package: require(path.join(rootDir, 'package.json'))
    }),
    new CheckerPlugin(),
    new CopyWebpackPlugin([
      {
        context: outputDir,
        from: path.join(srcDir, 'node_modules'),
        to: path.join(outputDir, 'node_modules'),
        ignore: ['*.md', '**/.bin/**', '**/test/**']
      },
      {
        from: path.join(srcDir, 'package.json'),
      }
    ])
  ]
};
