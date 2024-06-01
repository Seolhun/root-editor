const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');
const context = resolve(__dirname, '../src');

/**
 * Webpack common configuration
 * @type {import('webpack').Configuration}
 */
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '~': context,
    },
  },
  context: context,
  module: {
    rules: [
      {
        test: [/\.[jt]sx?$/],
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
  ],
  performance: {
    hints: false,
  },
};
