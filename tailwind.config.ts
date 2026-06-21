import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#ffffff",
          dark: "#0b0f17",
        },
        surface: {
          DEFAULT: "#f5f5f5",
          dark: "#111827",
        },
        accent: {
          DEFAULT: "#2563eb",
          dark: "#3b82f6",
        },
      },
      keyframes: {
        bounceDot: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
      },
      animation: {
        "bounce-dot": "bounceDot 1.4s infinite ease-in-out both",
      },
    },
  },
  plugins: [typography],
};

export default config;
