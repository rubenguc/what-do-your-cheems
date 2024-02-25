/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          default: "var(--primary-color)",
          hover: "var(--primary-color)",
        },
      },
    },
  },
  plugins: [],
};
