import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-poppins)", "sans-serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      colors: {
        brand: {
          black: "#0a0a0a",
          white: "#fafafa",
          accent: "#e8f015",
          "gray-soft": "#f5f5f3",
          "gray-mid": "#d4d4d0",
          "gray-text": "#6b6b66",
        },
        status: {
          // Disponível — verde
          "success-bg":     "#ecfdf5",
          "success-text":   "#047857",
          "success-border": "#a7f3d0",
          // Em Negociação — âmbar
          "warning-bg":     "#fffbeb",
          "warning-text":   "#b45309",
          "warning-border": "#fde68a",
          // Vendido — cinza neutro (usa tokens brand existentes)
          // bg:     brand-gray-soft  (#f5f5f3)
          // text:   brand-gray-text  (#6b6b66)
          // border: brand-gray-mid   (#d4d4d0)
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
