/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#D04F4F",
        gray: {
          25: "#EDEDED",
          50: "#F7F7F7",
          100: "#E7E7E7",
          200: "#C7BEBE",
          300: "#7A7A7A",
        },
        filter: {
          blue: "#3282F7",
          green: "#68D9A4",
          orange: "#ED6454",
        },
        yellow: "#FFD15B",
        black: "#1B1B1B",
      },
      fontFamily: {
        default: ["Manrope", "sans-serif"],
        anton: ["Anton", "sans-serif"],
      },
      fontSize: {
        "recipe-title": "18px",
        "recipe-text": "12px",
      },
      height: {
        "recipe-img": "178px",
      },
    },
  },
  plugins: [],
};
