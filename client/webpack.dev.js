const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
    minimize: false
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
      watch: true,
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/pelaporan.*/, to: '/index.html' },
        { from: /^\/admin.*/, to: '/index.html' },
        { from: /./, to: '/index.html' }
      ]
    },
    open: true,
    port: 9000,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    compress: true,
    hot: 'only',
    devMiddleware: {
      writeToDisk: true,
    },
    watchFiles: {
      paths: ['src/**/*'],
      options: {
        usePolling: false,
        ignored: /node_modules/,
        awaitWriteFinish: {
          stabilityThreshold: 500,
          pollInterval: 100
        }
      },
    },
  },
  watchOptions: {
    ignored: ['**/node_modules/**', '**/dist/**'],
    aggregateTimeout: 200,
    poll: false
  },
});