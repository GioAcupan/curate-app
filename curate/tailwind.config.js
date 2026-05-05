/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF3E0",
          100: "#FFD9A8",
          200: "#FFB84D",
          300: "#FF9500",
          400: "#FF8200",
          500: "#FF6D00",
          600: "#E56200",
          700: "#BF5000",
          800: "#8C3A00",
          900: "#5C2600",
        },
        surface: {
          base: "#0A0A0F",
          card: "rgba(22,22,30,0.85)",
          elevated: "rgba(30,30,42,0.9)",
        },
        text: {
          primary: "#F0EFF4",
          secondary: "rgba(240,239,244,0.6)",
          muted: "rgba(240,239,244,0.35)",
        },
        border: {
          subtle: "rgba(255,255,255,0.06)",
          default: "rgba(255,255,255,0.1)",
          strong: "rgba(255,255,255,0.18)",
        },
        signal: {
          success: "#22C55E",
          warning: "#FBBF24",
          info: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["PlusJakartaSans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "100px",
      },
    },
  },
  plugins: [],
};
