/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.css',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },

      colors: {
        primary: {
          light: '#FFFFFF',
          dark: '#171717',
        },
        secondary: {
          dark: '#242424',
        },
        accent: {
          dark: '#858585',
        },
        typography: {
          light: 'rgba(0,0,0,0.8)',
          dark: 'rgba(255,255,255,0.5)',
        },
      },

      screens: {
        // Responsive breakpoints (keep your custom logic)
        'max-xl': { max: '1199px', min: '880px' },
        'max-md': { max: '880px', min: '767px' },
      },
    },
  },

  plugins: [],
};
