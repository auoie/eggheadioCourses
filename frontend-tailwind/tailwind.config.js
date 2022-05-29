module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        zinc: {
          950: "#0e0e11",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
