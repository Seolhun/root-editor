const { resolve } = require('path');
const context = resolve(__dirname, '../src');

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  core: {
    builder: 'webpack5',
  },
  staticDirs: ['../public'],
  features: {
    previewMdx2: true, // 👈 MDX 2 enabled here
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
  ],
  webpackFinal: async (config) => {
    config.resolve.alias = {
      '@': context,
    }
    config.context = context;
    config.module.rules.push(
      {
        test: [/\.[jt]sx?$/],
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    )
    return config;
  },
};
