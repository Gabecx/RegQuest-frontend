/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00007F",
        accent: "#FEC956",
        darkgray: "#4B4A4A",
      },
    },
  },
  plugins: [],
}