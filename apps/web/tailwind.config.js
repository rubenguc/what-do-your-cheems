/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          default: "#1e40af",
          hover: "#2563eb",
        },
      },
    },
  },
  plugins: [],
};
