/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#fff1f3',
          100: '#ffe4e9',
          500: '#ea5a7a',
          700: '#b52049',
        },
      },
    },
  },
  plugins: [],
};
