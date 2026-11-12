/**
 * Web palette for Tailwind, taken from the app's theme.ts so site and app match.
 * Dark-mode values are derived from the brand colours (the app has no dark theme).
 *
 * tailwind.config.ts → theme.extend.colors:  { gh: ghColors }
 * (replace any existing `gh` colour block)
 */
export const ghColors = {
  // Brand
  primary: { DEFAULT: "#D4AF37", light: "#E8C547", dark: "#B8941F" },
  secondary: { DEFAULT: "#FF8A00", dark: "#E67300", light: "#FFB04D" },
  tertiary: { DEFAULT: "#337D6E", dark: "#246156", light: "#5FB5A3" },

  // Light surfaces (from the app)
  background: "#FFF8E7",
  card: "#FFF2DC",
  border: "#E8DCC0",

  // Text (from the app)
  text: "#333333",
  "text-light": "#777777",
  "text-dark": "#1A1A1A",

  // Dark mode (derived: warm near-black so gold keeps its glow)
  "background-dark": "#14120C",
  "surface-dark": "#2A2619",
} as const;