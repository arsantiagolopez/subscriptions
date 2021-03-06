const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1f1f1f",
        secondary: "#252525",
        tertiary: "#292929",
        fourth: colors.gray[300],
      },
      fontFamily: {
        Basic: ["Basic", "sans-serif"],
      },
      display: ["group-hover"],
    },
  },
};
