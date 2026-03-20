/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "/.index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2B2B2B",   // main buttons
          secondary: "#F5EDE6", // background
          accent: "#E7DCD2",    // subtle UI
        },
      },
    },
  },
  plugins: [],
}

