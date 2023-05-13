/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "github-dark": {
          bg1: "#0D1117",
          bg2: "#161B22",
          bg3: "#21262D",
          border: "#30363D",
        },
        "github-light": {
          bg2: "#F6F8FA",
          border: "#D0D7DE",
        },
      },
      fontFamily: {
        sans: ["var(--font-product)"],
      },
    },
  },
  plugins: [],
};
