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
   new WorkboxWebpackPlugin.GenerateSW({
     clientsClaim: true,
     skipWaiting: true,
     runtimeCaching: [
       {
         urlPattern: new RegExp('^https://urbanaid-server\\.up\\.railway\\.app/api/'),
         handler: 'NetworkFirst',
         options: {
           cacheName: 'api-cache',
           networkTimeoutSeconds: 5,
           expiration: {
             maxEntries: 100,
             maxAgeSeconds: 72 * 60 * 60, // 72 hours
           },
           cacheableResponse: {
             statuses: [0, 200]
           }
         }
       },
       {
         urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
         handler: 'CacheFirst',
         options: {
           cacheName: 'images',
           expiration: {
             maxEntries: 60,
             maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
           },
         },
       }
     ]
   })
 ]
});