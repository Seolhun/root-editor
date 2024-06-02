const { resolve } = require("path");
const { merge } = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const commonConfig = require("./webpack.common");

module.exports = merge(commonConfig, {
  mode: "production",
  entry: "./index.ts",
  output: {
    filename: "app.min.js",
    path: resolve(__dirname, "../dist"),
    publicPath: "/",
  },
  devtool: "source-map",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "app.min.css",
      chunkFilename: "[id].css",
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
  },
});
