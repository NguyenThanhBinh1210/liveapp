/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      height: {
        'real-screen': 'calc(var(--vh) * 100)'
      },
      minHeight: {
        'real-screen': 'calc(var(--vh) * 100)'
      }
    }
  },
  plugins: []
}
