/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ava': {
          50: '#fdf8f6',
          100: '#f9ebe5',
          200: '#f4d4c8',
          300: '#e9b8a3',
          400: '#db9477',
          500: '#cc7655',
          600: '#b85d3f',
          700: '#9a4a33',
          800: '#7d3e2d',
          900: '#663628',
          gold: '#d4af37',
          'gold-light': '#f4e4bc',
          'gold-dark': '#b8962e',
          rose: '#e8c4c4',
          cream: '#faf7f5',
        }
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'script': ['Dancing Script', 'cursive'],
        'elegant': ['Cormorant Garamond', 'serif'],
        'modern': ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
