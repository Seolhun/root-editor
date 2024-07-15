import RootUITailwindConfigs from '@seolhun/root-ui-tailwind';

/** @type {import('tailwindcss').Config} */
const config = {
  /**
   * @name Purge
   * @see https://tailwindcss.com/docs/content-configuration
   */
  content: [
    './node_modules/@seolhun/root-editor/dist/**/*.{ts,tsx,js,jsx}',
    './node_modules/@seolhun/root-ui/dist/**/*.{ts,tsx,js,jsx}',
    './node_modules/@seolhun/firststage-components/dist/**/*.{ts,tsx,js,jsx}',
    './node_modules/@seolhun/firststage-containers/dist/**/*.{ts,tsx,js,jsx}',
    './src/app/**/*.{ts,tsx,js,jsx}',
  ],

  darkMode: 'selector',

  plugins: [
    ...RootUITailwindConfigs,
	],
};

export default config;
