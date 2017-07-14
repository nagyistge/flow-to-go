const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ConcatPlugin = require('webpack-concat-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader')

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const outputDir = path.join(rootDir, 'dist');

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
    filename: '[name].js',
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
        use: ['style-loader', 'css-loader']
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
    new ConcatPlugin({
        fileName: 'node_modules/node-red/nodes/flow-to-go.html',
        filesToConcat: glob.sync(path.join(srcDir, 'main', 'nodes', '**', '*.html'))
    }),
    new CopyWebpackPlugin([
      {
        context: outputDir,
        from: path.join(srcDir, 'node_modules'),
        to: path.join(outputDir, 'node_modules'),
        ignore: [
          '*.md*',
          '**/test/**',
          '.bin/**', '**/.bin/**', '**/bin/**',
          '**/node-red/nodes/core/hardware/**']
      },
      {
        from: path.join(srcDir, 'package.json'),
      },
      {
        from: path.join(srcDir, 'main', 'nodes', 'dummy'),
        to: path.join(outputDir, 'node_modules', 'node-red', 'nodes', 'flow-to-go.js'),
      },
      {
        from: path.join(rootDir, 'icons', 'cog*.png'),
      }
    ])
  ]
};
