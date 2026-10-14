import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        paper: {
          50: "#FCFBF9",
          100: "#FAF9F5",
          200: "#F4F1EA",
          300: "#EAE5D9",
        },
        ink: {
          900: "#141413",
          800: "#1F1E1D",
          700: "#2B2A27",
          600: "#44403C",
          500: "#716E68",
          400: "#A8A29E",
          300: "#D6D3D1",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle: "#E7E5E4",
          card: "#E4DFD5",
        },
        navy: {
          DEFAULT: "#1E3A8A",
          hover: "#172554",
          dim: "#DBEAFE",
          subtle: "rgba(30, 58, 138, 0.08)",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
