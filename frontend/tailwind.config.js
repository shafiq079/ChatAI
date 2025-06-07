/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: '#1e293b',
      accent: '#f59e42',
      background: '#f8fafc',
    }
  }
},
  plugins: [],
}