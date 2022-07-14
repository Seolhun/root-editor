const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const context = resolve(__dirname, "../src");

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@": context,
    },
  },
  context: context,
  module: {
    rules: [
      {
        test: [/\.[jt]sx?$/],
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: [/\.css$/i],
        use: [
          'postcss-loader'
        ],
      },
      {
        test: [/\.scss$/i],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  performance: {
    hints: false,
  },
};
