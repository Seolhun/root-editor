const path = require('path');
const context = path.resolve(__dirname, 'src');
const assets = path.join(context, 'assets');

/**
 * @type {import('next').NextConfig}
 */
const config = {
  /**
   * To build multiple apps in a monorepo, you can set basePath to the app's name.
   */
  experimental: {
    esmExternals: 'loose',
  },
  /**
   * If this value is true, useEffect and useLayoutEffect is called twice in mounted.
   * This is a bug in React 18.
   * @see https://github.com/facebook/react/issues/24502
   */
  reactStrictMode: false,
  trailingSlash: false,
  webpack: (config, { isServer }) => {
    /**
     * Aliases
     */
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': context,
    };
    return config;
  },
};

module.exports = config;
