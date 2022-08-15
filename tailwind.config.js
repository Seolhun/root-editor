const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');


const { NegativeMargins } = require('./tailwind-config/margin');
const { MinHeight } = require('./tailwind-config/minHeight');
const { MinWidth } = require('./tailwind-config/minWidth');

const intentColors = {
  white: colors.white,
  black: colors.black,
  light: colors.gray,
  dark: colors.gray,
  primary: colors.blue,
  secondary: colors.sky,
  info: colors.cyan,
  success: colors.green,
  warning: colors.orange,
  danger: colors.red,
  error: colors.red,
}

module.exports = {
  /**
   * @name Purge
   * @see https://tailwindcss.com/docs/content-configuration
   */
  content: [
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/plugins/**/*.{ts,tsx,js,jsx}',
  ],
  /**
   * string literal을 같이 사용한 경우 tailwind가 class를 인식하지 못해서 purge 되는 현상이 발생합니다.
   */
  safelist: [
    // {
    //   pattern: /w-.*/,
    //   variants: ['xs', 'sm', 'md', 'lg', 'xl'],
    // },
    // {
    //   pattern: /bg-.*/,
    //   variants: ['hover'],
    // },
    // {
    //   pattern: /text-.*/,
    //   variants: ['hover'],
    // },
  ],
  /**
   * @name Extends
   * @see https://tailwindcss.com/docs/theme
   */
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      // Platforms
      google: '#4285f4',
      kakao: '#FEE500',
      naver: '#19ce60',
    }),
    borderColor: theme => ({
      ...theme('colors'),
      // Platforms
      google: '#4285f4',
      kakao: '#FEE500',
      naver: '#19ce60',
    }),
    textColor: theme => ({
      ...theme('colors'),
      title: intentColors.light[800],
      description: intentColors.light[600],
      comment: intentColors.light[500],
      link: '#0a66c2',
      // Platforms
      google: '#ffffff',
      kakao: '#000000',
      naver: '#ffffff',
    }),
    boxShadow: {
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 2px 3px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none',
    },
    // @see https://tailwindcss.com/docs/customizing-colors
    colors: {
      ...colors,
      ...intentColors,
    },
    fontFamily: {
      'sans': 'Helvetica, Arial, sans-serif',
    },
    minWidth: {
      ...MinWidth,
    },
    minHeight: {
      ...MinHeight,
    },
    screens: {
      sm: '480px',
      // => @media (min-width: 480px) { ... }
      md: '768px',
      // => @media (min-width: 768px) { ... }
      lg: '1024px',
      // => @media (min-width: 976px) { ... }
      xl: '1280px',
      // => @media (min-width: 1440px) { ... }
    },
    extend: {
      borderRadius: {
        '4xl': '2rem'
      },
      margin: {
        ...NegativeMargins,
      },
      outline: {
        light: [`2px solid ${intentColors.light[600]}`, '0px'],
        dark: [`2px solid ${intentColors.dark[600]}`, '0px'],
        primary: [`2px solid ${intentColors.primary[600]}`, '0px'],
        secondary: [`2px solid ${intentColors.secondary[600]}`, '0px'],
        info: [`2px solid ${intentColors.info[600]}`, '0px'],
        success: [`2px solid ${intentColors.success[600]}`, '0px'],
        warning: [`2px solid ${intentColors.warning[600]}`, '0px'],
        danger: [`2px solid ${intentColors.danger[600]}`, '0px'],
        error: [`2px solid ${intentColors.error[600]}`, '0px'],
      },
      spacing: {
        128: '32rem',
        144: '36rem'
      },
      transitionProperty: {
        'background': 'background',
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionDuration: {
        '1500': '1500ms',
        '2000': '2000ms',
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['checked'],
      borderColor: ['checked'],
      cursor: ['disabled'],
      opacity: ['disabled'],
      outline: ['hover', 'active', 'focus'],
      width: ['focus'],
      /**
       * @see https://tailwindcss.com/docs/transition-property
       */
      transitionProperty: ['hover', 'focus'],
    }
  },
  // https://tailwindcss.com/docs/plugins#adding-base-styles
  plugins: [
    plugin(function({ addBase, theme }) {
      addBase({
        'h1': { fontSize: theme('fontSize.3xl') },
        'h2': { fontSize: theme('fontSize.2xl') },
        'h3': { fontSize: theme('fontSize.1xl') },
        'h4': { fontSize: theme('fontSize.lg') },
        'h5': { fontSize: theme('fontSize.base') },
        'h6': { fontSize: theme('fontSize.sm') },
      })
    })
  ]
}
