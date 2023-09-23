const Dotenv = require('dotenv-webpack')
const webpack = require('webpack')

const path = require('path')

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'client/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'main.js',
    clean: false,
    publicPath: './',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
        },
      },
      {
        test: /\.(sass|less|css)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
}
