const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, options) => {
  return {
    entry: './src/js/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.bundle.js',
    },
    externals: {
      "fs": "commonjs fs"
    },
    devServer: {
      open: true
    },
    devtool: options.mode === 'development' ? 'eval-source-map' : false,
    module: {
      rules: [
        {
          test: /\.hbs$/i,
          loader: 'html-loader'
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            options.mode !== "production"
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.(png|svg)$/,
          loader: 'url-loader',
          options: {
            name: 'img/[name].[ext]',
          },
        }
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './index.hbs',
        filename: 'index.html'
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css"
      }),
    ],
  }
}



