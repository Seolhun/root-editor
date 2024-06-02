const { resolve } = require('path');
const { merge } = require("webpack-merge");
const commonConfig = require("../build/webpack.common");

export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../public', '../src/assets'],

  features: {
    previewMdx2: true, // 👈 MDX 2 enabled here
  },

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
    '@storybook/addon-webpack5-compiler-babel',
    '@chromatic-com/storybook'
  ],

  /**
   * @param {import('webpack').Configuration} config
   */
  webpackFinal: async (config) => {
    return merge(commonConfig, config, {

    });
  },

  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },

  docs: {},

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
};
