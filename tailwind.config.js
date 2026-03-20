/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      // AQUÍ ES DONDE SUCEDE LA MAGIA
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