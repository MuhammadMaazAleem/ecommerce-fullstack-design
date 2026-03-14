/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f3f7ff',
          100: '#dce8ff',
          500: '#1f6bff',
          700: '#154cc0',
        },
        accent: {
          500: '#f97316',
          600: '#ea580c',
        },
      },
      boxShadow: {
        card: '0 8px 24px rgba(24, 39, 75, 0.08)',
      },
    },
  },
  plugins: [],
};
