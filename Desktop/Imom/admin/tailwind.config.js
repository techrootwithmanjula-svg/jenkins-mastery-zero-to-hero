/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  safelist: [
    {
      pattern: /^(space|gap|p|m)(-[trblxy])?-\d+$/,
    },
  ],

  theme: {
    extend: {},
  },

  plugins: [],
};