/** @type {import('tailwindcss').Config} */
module.exports = {
  relative: true,
  content: ['./index.html', './src/**/*.vue'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    darkTheme: 'halloween'
  }
}
