const path = require('path');
let webpack = require('webpack');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/plugin/main.js'),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "view-img.js",
    // publicPath: "./dist/"
    library: 'view-img', // 模块名称
    libraryTarget: 'umd', // 输出格式
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.js', '.vue']
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: "babel-loader" },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false,
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  ]
}