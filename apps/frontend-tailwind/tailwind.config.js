const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/next/tailwind');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, './{pages,components}/**/*.{js,ts,jsx,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [require('../../tailwind-workspace-preset')],
};
