/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './src/**/*.{html,js,mjs}',
    './content/**/*.{html,js,mjs,json}',
    './tools/**/*.{js,mjs}',
    './scripts/**/*.{js,mjs}'
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#f97316',
        'brand-orangeHover': '#ea580c',
        'brand-blue': '#0f172a'
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Manrope', 'sans-serif']
      }
    }
  },
  plugins: []
};
