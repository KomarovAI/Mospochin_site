/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./**/*.js", "!./node_modules/**"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
        nunitoDisplay: ['Nunito', 'sans-serif']
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight: '-0.025em',
        snug: '-0.015em'
      },
      lineHeight: {
        relaxed: '1.75',
        none: '1.08',
        tight: '1.2'
      },
      colors: {
        brand: {
          orange: '#f97316',
          orangeHover: '#ea580c',
          blue: '#0f172a',
          lightBlue: '#1e293b',
          green: '#22c55e',
          gray: '#f8fafc',
          primary: '#f97316',
          primaryHover: '#ea580c',
          accent: '#ea580c'
        }
      }
    }
  },
  plugins: []
}
