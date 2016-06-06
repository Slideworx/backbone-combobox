var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    app: './index.js',
    vendor: ['jquery', 'lodash', 'backbone', 'classnames']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'combobox.js'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.combobox.js'),
    new ExtractTextPlugin('combobox.css')
  ]
};
