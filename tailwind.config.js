/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0D10",
        surface: "#14181E",
        glass: "rgba(255, 255, 255, 0.06)",
        gold: {
          DEFAULT: "#D6AD55",
          foreground: "#FFFFFF",
        },
        amber: {
          DEFAULT: "#F0A43A",
          foreground: "#FFFFFF",
        },
        text: {
          primary: "#F7F7F7",
          secondary: "#A7ADB7",
        },
        success: "#38B87C",
        warning: "#F0B34C",
        error: "#E45C5C",
      },
    },
  },
  plugins: [],
}
