/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        palacio: {
          gold: '#D4AF37',
          'gold-light': '#F3E5AB',
          'gold-dark': '#B8972E',
          bg: '#050505',
          dark: '#0a0a0a',
          card: '#111111',
          border: 'rgba(212, 175, 55, 0.25)',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      // AQUÍ ES DONDE SUCEDE LA MAGIA[cite: 15]
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 1.2s ease-out forwards',
        'float': 'float 5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}