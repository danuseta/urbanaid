const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const { DefinePlugin } = require('webpack');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    publicPath: '/',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['> 1%', 'last 2 versions']
                  },
                  useBuiltIns: 'usage',
                  corejs: 3
                }]
              ]
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'BASE_URL': JSON.stringify('https://urbanaid-server.up.railway.app/api'),
        'CLIENT_URL': JSON.stringify('https://urbanaid-client.vercel.app')
      }
    }),
    // Menggunakan InjectManifest untuk Service Worker custom
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: path.resolve(__dirname, 'sw.js'),
      swDest: 'sw.js',
      maximumFileSizeToCacheInBytes: 5000000,
      exclude: [
        /\.map$/,
        /manifest$/,
        /\.htaccess$/,
        /service-worker\.js$/,
      ],
    })
  ]
});