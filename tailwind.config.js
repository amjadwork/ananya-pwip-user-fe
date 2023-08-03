/** @type {import('tailwindcss').Config} */

import { color } from "./theme/color";

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-black",
    "bg-opacity-25",
    "z-50",
    "h-screen",
    "h-auto",
    "w-screen",
    "w-auto",
    "inline-flex",
    "items-center",
    "justify-center",
    "px-7",
    "pt-5",
    "pb-8",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Gilroy", "arial"],
        sans: ["DM-sans", "sans-serif"],
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",
      black: "#000",
      ...color,
    },
  },
  plugins: [],
};
