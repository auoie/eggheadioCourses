const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/next/tailwind');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, './{pages,components}/**/*.{js,ts,jsx,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fira Sans', ...defaultTheme.fontFamily.sans],
        mono: ['Fira Code', ...defaultTheme.fontFamily.mono],
      },
      screens: {
        '3xl': '2160px',
      },
    },
  },
  plugins: [],
  presets: [require('../../tailwind-workspace-preset')],
};
