module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1ed',
          100: '#ffe4de',
          200: '#ffbfae',
          300: '#ff997e',
          400: '#ff5532',
          500: '#ff5532',
          600: '#e64c2e',
          700: '#b93c24',
          800: '#8c2d1b',
          900: '#5f1e12',
        },
        secondary: {
          100: '#f9fafb',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
