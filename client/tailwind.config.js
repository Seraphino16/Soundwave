/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,css}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        'primaryBlue' : "#93AFD9",
        'light-bg': 'rgba(147, 175, 217, 0.36)',
        'content-bg': 'rgba(255, 255, 255, 0.60)',
      },
    },
  },
  plugins: [],
};