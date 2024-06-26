import RootUITailwindConfigs from '@seolhun/root-ui-tailwind';

/** @type {import('tailwindcss').Config} */
const config = {
  /**
   * @name Purge
   * @see https://tailwindcss.com/docs/content-configuration
   */
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
  ],

  darkMode: 'selector',

  plugins: [
    ...RootUITailwindConfigs,
	],
};

export default config;
