/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        linen: "#FBF9F5",
        sand: "#F5F2EB",
        obsidian: "#18181B",
        terracotta: {
          DEFAULT: "#C26D53",
          hover: "#A85840",
          light: "#FDF5F2",
        },
        sage: {
          DEFAULT: "#2C4A3E",
          hover: "#223B31",
          light: "#EBF3EE",
        },
        brazil: {
          green: "#2C4A3E",
          yellow: "#C26D53",
          blue: "#18181B",
          dark: "#18181B",
          card: "#FFFFFF",
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
