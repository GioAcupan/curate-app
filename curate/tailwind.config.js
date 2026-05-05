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
          "base-light": "#F5F0EB",
          card: "rgba(22,22,30,0.85)",
          "card-light": "rgba(255,255,255,0.7)",
          elevated: "rgba(30,30,42,0.9)",
          "elevated-light": "rgba(255,255,255,0.85)",
        },
        text: {
          primary: "#F0EFF4",
          "primary-light": "#1A1520",
          secondary: "rgba(240,239,244,0.6)",
          "secondary-light": "rgba(26,21,32,0.55)",
          muted: "rgba(240,239,244,0.35)",
          "muted-light": "rgba(26,21,32,0.35)",
        },
        border: {
          subtle: "rgba(255,255,255,0.06)",
          "subtle-light": "rgba(0,0,0,0.06)",
          default: "rgba(255,255,255,0.1)",
          "default-light": "rgba(0,0,0,0.1)",
          strong: "rgba(255,255,255,0.18)",
          "strong-light": "rgba(0,0,0,0.18)",
        },
        signal: {
          success: "#22C55E",
          warning: "#FBBF24",
          info: "#3B82F6",
        },
        accent: {
          glow: "rgba(255,109,0,0.15)",
          "glow-light": "rgba(255,109,0,0.12)",
        },
        glass: {
          default: "rgba(255,255,255,0.08)",
          "default-light": "rgba(255,255,255,0.7)",
          liquid: "rgba(255,255,255,0.04)",
          "liquid-light": "rgba(255,255,255,0.35)",
          fluent: "rgba(255,255,255,0.12)",
          "fluent-light": "rgba(255,255,255,0.65)",
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
