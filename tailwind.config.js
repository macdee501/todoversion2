
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        appBackground: "#F2F2F2",
        appButton: "#3F3F3F",
        appText: "#242424",
      },
    },
  },
  plugins: [],
};
