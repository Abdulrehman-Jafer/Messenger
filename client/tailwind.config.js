const withMT = require("@material-tailwind/react/utils/withMT");
/** @type {import('tailwindcss').Config} */
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "pink-red" : "#ed4f5c",
        "light-gray": "#e7eaed",
        "add-bg-gray":"#d6dce4",
        "grayish" : "#acb8c4",
        "more-grayish": "#a0afc0",
        "little-gray": "#97a7ba",
        "blueish" : "#193b64",
        "light-pink": "#fbadb3"
      }
    },
  },
  plugins: [],
})