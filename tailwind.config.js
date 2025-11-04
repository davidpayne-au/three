/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2cb5ff',
          dark: '#0b4b75',
        },
      },
    },
  },
  plugins: [],
}
