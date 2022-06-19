/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        zinc: {
          950: '#0e0e11',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
