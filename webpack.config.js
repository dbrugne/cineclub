const webpack = require('webpack');

module.exports = {
  entry: {
    jsx: './lib/client/index.js',
    vendor: [
      './webpack.init.js',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-logger',
      'redux-thunk',
      'whatwg-fetch',
    ],
  },
  output: {
    path: './public/bundles',
    publicPath: '/bundles/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  devServer: {
    contentBase: './public/bundles/',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
    }],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
  ],
};
