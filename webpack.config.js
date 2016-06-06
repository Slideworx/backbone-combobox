var path = require('path');
var webpack = require('webpack');
var deps = require('./package.json').dependencies;
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    app: './index.js',
    // vendor: ['jquery', 'lodash', 'backbone', 'classnames']
  },
  output: {
    libraryTarget: 'amd',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  externals: Object.keys(deps),
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      }
    ]
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.combobox.js'),
    new ExtractTextPlugin('index.css')
  ]
};
