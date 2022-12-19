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
        blue: {
          DEFAULT: '#3E4B5F',
          '50': '#98A7BC',
          '100': '#8C9CB4',
          '200': '#7387A4',
          '300': '#5E7290',
          '400': '#4E5E78',
          '500': '#3E4B5F',
          '600': '#28303D',
          '700': '#12151B',
          '800': '#000000',
          '900': '#000000'
        },
        red: {
          DEFAULT: '#EB5D2D',
          '50': '#FBDED5',
          '100': '#F9D0C2',
          '200': '#F6B39D',
          '300': '#F29678',
          '400': '#EF7A52',
          '500': '#EB5D2D',
          '600': '#CC4213',
          '700': '#99320F',
          '800': '#66210A',
          '900': '#331005'
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
