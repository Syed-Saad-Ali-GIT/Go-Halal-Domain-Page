import type { Config } from "tailwindcss";

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

const config: Config = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /** Matches go-halal-expo/constants/theme.ts */
        gh: {
          primary: "#D4AF37",
          "primary-light": "#E8C547",
          "primary-dark": "#B8941F",
          secondary: "#FF8A00",
          "secondary-light": "#FFB347",
          "secondary-dark": "#E67300",
          tertiary: "#337D6E",
          "tertiary-light": "#4A9985",
          "tertiary-dark": "#246156",
          background: "#FFF8E7",
          "background-muted": "#F5F0E0",
          card: "#FFF2DC",
          "card-pressed": "#F0E6D3",
          text: "#333333",
          "text-light": "#777777",
          "text-dark": "#1A1A1A",
          border: "#E8DCC0",
          ink: "#1A1612",
          "surface-dark": "#2A261F",
          "background-dark": "#1A1814",
        },
        trueGray: colors.neutral,
      },
      fontFamily: {
        sans: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
        stock: [defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        gh: "0 4px 14px rgba(0, 0, 0, 0.08)",
        "gh-lg": "0 12px 40px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
