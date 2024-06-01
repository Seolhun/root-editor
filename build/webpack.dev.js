const { resolve } = require("path");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");

module.exports = merge(commonConfig, {
  mode: "production",
  entry: "./index.tsx",
  output: {
    filename: "app.min.js",
    path: resolve(__dirname, "../dist"),
    publicPath: "/",
  },
  devtool: "source-map",
});
