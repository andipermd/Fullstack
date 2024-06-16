/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./gis/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        "pop": ["Poppins"]
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

