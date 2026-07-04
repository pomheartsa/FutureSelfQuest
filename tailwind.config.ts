import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "var(--font-noto-thai)",
          "Segoe UI",
          "system-ui",
          "sans-serif"
        ]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(41, 91, 155, 0.22)",
        insetPanel: "inset 0 1px 0 rgba(255,255,255,0.78), 0 20px 70px rgba(49, 86, 130, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
