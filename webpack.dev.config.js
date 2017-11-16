const path = require('path');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    publicPath: '/'
  },
  // devtool: "source-map",
  resolve: {
    extensions: ['.js', '.vue']
  },
  devServer: {
    compress: true,
    port: 4000,
    hot: true
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: "babel-loader" },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ["style-loader","css-loader"]
      },
      { test: /\.(jpe?g|png)$/, use: 'file-loader?name=images/[name].[hash:8].[ext]' }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({
      url: 'http://localhost:4000'
    })
  ]
}