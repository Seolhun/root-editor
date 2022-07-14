const { resolve } = require("path");

const appRoot = resolve(__dirname, "../");
const appSource = resolve(__dirname, "../src");

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  core: {
    builder: 'webpack5',
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  disabledPresets: ['@storybook/react/preset'],
  webpackFinal: async (config) => {
    Object.assign(config.resolve.alias, {
      "@": appSource,
    })
    config.module.rules.push(
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
        include: appRoot,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
        include: appRoot,
      }
    )
    return config;
  },
};
