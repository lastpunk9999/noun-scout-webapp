/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Source Sans Pro', ...defaultTheme.fontFamily.sans],
      'serif': ['Source Serif Pro', ...defaultTheme.fontFamily.serif],
    },
    extend: {
      display: ["group-hover"],
      colors: {
        ...defaultTheme.colors,
        // TODO: add color variants here
        blue: {
          100: '#3E4B5F',
          200: '#3E4B5F',
          300: '#3E4B5F',
          400: '#3E4B5F',
          500: '#3E4B5F',
          600: '#3E4B5F',
          700: '#3E4B5F',
          800: '#3E4B5F',
          900: '#3E4B5F',
        },
        'red': '#EB5D2D',
      },
      // TODO: typography overrides aren't working here
      // typography: (theme) => ({
      //   DEFAULT: {
      //     css: {
      //       color: theme('colors.gray.700'),
      //     },
      //   },
      // }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
