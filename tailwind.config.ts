import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: "var(--font-poppins)",
      },
      colors: {
        "light-white": "#E6EFFF",
        "golden-white": "#d3ffff",
        "light-black": "#010101",
        "text-blue": "#3366ff",
        "light-blue": "rgba(51, 102, 255, 0.08)",
        "back-white": "#F8F7F6",
        "logo-primary-gradient": "#1E4AA1",
        "logo-primary": "#1D68FF",
        light: {
          "light-white": "#E6EFFF",
          "golden-white": "#d3ffff",
          "light-black": "#010101",
          "text-blue": "rgb(51, 102, 255)",
          "light-blue": "rgba(51, 102, 255, 0.08)",
        },
        dark: {
          "logo-primary": "#1D68FF",
          "logo-primary-gradient": "#1E4AA1",
          "primary-text": "#EAF3FF",
          "secondary-text": "#83AADF",
          "custom-dark-blue": "#050E1B",
          "custom-blue": "#0D1827",
          "custom-blue-stroke": "#122237",
          "button-blue": "#1E375A",
          "text-hover": "#122033",
        },
      },
      animation: {
        border: "border 4s linear infinite",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
