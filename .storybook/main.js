const { resolve } = require("path");
const context = resolve(__dirname, "../src");

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
      "@": context,
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
        include: resolve(__dirname, '../'),
      },
      {
        test: [/\.scss$/i],
        use: [
          'css-loader',
          'sass-loader',
        ],
        include: resolve(__dirname, '../'),
      }
    )
    return config;
  },
};
