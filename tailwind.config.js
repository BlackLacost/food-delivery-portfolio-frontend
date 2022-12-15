const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      screens: {
        sm: '100%',
        '2xl': '1536px',
      },
      padding: {
        DEFAULT: '1.25rem',
      },
    },
    extend: {
      colors: {
        primary: colors.lime,
      },
      fontFamily: {
        logo: ['Montserrat', 'sans-serif'],
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}
