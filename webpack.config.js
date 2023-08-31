/*
This config allows you to keep your entire project in your source directory
and will build your entire distribution directory, no need to manually place
html or assets like images, audio, fonts and css.  Be sure to import all assets 
into your javascript so webpack can find them (as opposed to linking them in
your html document)!  See /client/index.js and /client/index.html.

Run 'npm run build' and watch it build your entire 'public' directory 
(i.e. distribution directory)

Resulting file structure (irrespective of source file structure):

{Distribution Directory}
 |-index.html
 |-main.[hash].js (hashed filename prevent client-side caching, handy for dev)
 |+audio (directory)
 |+css (directory)
 |+fonts (directory)
 |+images (directory)

Place your index.html in your source root directory or reconfigure the HtmlWebpackPlugin 
below.  Webpack will make a copy and inject links to bundled javascript and a composite 
stylesheet. No need to manually link those in.

Works with single or multiple css stylesheets and sass as well.  Produces
a single separate css stylesheet and links it in.  Purges unused stylesheet
elements.  This can reduce the stylesheet size by more than 90% when using a large 
open source css framework like Bootstrap.  Be sure to import your stylesheet(s) or
scss file(s) into your javascript (e.g import "./css/style.css").

Asset filenames will be hashed, appropriately linked in and moved to the right output asset
folder based on its filetype.  The output directory names can be configured differently
below.


*/

const path = require("path")
const glob = require("glob")
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

// for purgecss-webpack-plugin
const PATHS = {
  src: path.join(__dirname, "client"),
}

module.exports = {
  mode: "development", // 'production' or 'development'
  entry: {
    main: path.resolve(__dirname, "client/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true,
    publicPath: "./",
  },
  // use "inline-source-map" or "source-map" for troubleshooting
  // devtool: "inline-source-map",
  module: {
    rules: [
      {
        //use this rule fore react apps and transpiling
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        test: /\.(scss|css)$/i,
        use: [
          // "style-loader",
          // use plug-in below instead of "style-loader" above to produce separate css file.
          // This css extractor will work with the purge-unused-css plugin whereas the style-loader does not.
          // The style loader seems to work with webpack -watch better, so may be preferred for dev.
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: () => [require("autoprefixer")],
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "custom template",
      filename: "index.html",
      template: path.resolve(__dirname, "client/index.html"),
    }),
    new MiniCssExtractPlugin({ filename: "css/style.[contenthash].css" }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "client/assets_to_copy"),
          to: ".",
        },
      ],
    }),
  ],
}
