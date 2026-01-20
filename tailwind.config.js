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
          // Gris anthracite (couleur principale du logo)
          50: '#f7f7f7',
          100: '#ededed',
          200: '#d4d4d4',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6b6b6b',
          600: '#555555',
          700: '#4a4a4a', // Couleur principale du logo
          800: '#3d3d3d',
          900: '#2d2d2d',
          // Or/Beige (étoile du logo)
          gold: '#e8c88b',
          'gold-light': '#f5e6c8',
          'gold-dark': '#d4b574',
          // Couleurs secondaires
          cream: '#faf9f7',
          'cream-dark': '#f5f3ef',
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
