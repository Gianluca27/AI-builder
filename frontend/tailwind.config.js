/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f7ff",
          100: "#ebefff",
          200: "#d6dfff",
          300: "#b3c2ff",
          400: "#8c9eff",
          500: "#667eea",
          600: "#5568d3",
          700: "#4451b8",
          800: "#343b94",
          900: "#2a3077",
        },
        secondary: {
          500: "#764ba2",
          600: "#653f8f",
          700: "#55347a",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
