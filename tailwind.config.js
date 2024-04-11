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
    "bottom-[88px]",
    "text-gray-500",
    "z-40",
    "flex",
    "rounded-lg",
    "shadow",
    "dark:text-gray-400",
    "dark:bg-gray-800",
    "flex-shrink-0",
    "w-8",
    "h-8",
    "text-red-500",
    "bg-red-100",
    "rounded-lg",
    "dark:bg-red-800",
    "dark:text-red-200",
    "w-5",
    "h-5",
    "p-4",
    "mb-4",
    "sr-only",
    "ml-3",
    "text-sm",
    "font-normal",
    "ml-auto",
    "-mx-1.5",
    "-my-1.5",
    "bg-white",
    "text-gray-400",
    "hover:text-gray-900",
    "rounded-lg",
    "focus:ring-2",
    "focus:ring-gray-300",
    "p-1.5",
    "hover:bg-gray-100",
    "inline-flex",
    "items-center",
    "justify-center",
    "h-8",
    "w-8",
    "dark:text-gray-500",
    "dark:hover:text-white",
    "dark:bg-gray-800",
    "dark:hover:bg-gray-700",
    "w-3",
    "h-3",
    "currentColor",
    "px-6",
    "animate-spin",
    "mr-2",
    "text-gray-200",
    "dark:text-gray-600",
    "fill-blue-600",
    "bg-pwip-primary-100",
    "text-gray-200",
    "text-blue-200",
    "bg-blue-800",
    "bottom-[82px]",
    "h-screen",
    "w-screen",
    "bg-black",
    "absolute",
    "top-0",
    "left-0",
    "overflow-hidden",
    "bg-opacity-60",
    "space-y-3",
    "font-sans",
    "text-sm",
    "text-pwip-primary-50",
    "text-xs",
    "opacity-100",
    "opacity-0",
    "transition-all",
    "duration-300",
    "w-[90%]",
    "w-[85%]",
    "rounded-xl",
    "space-x-3",
    "outline-none",
    "bg-transparent",
    "border-none",
    "text-pwip-gray-800",
    "w-6",
    "h-6",
    "w-full",
    "font-semibold",
    "font-medium",
    "rounded-r-md",
    "py-2",
    "px-4",
    "border-[1px]",
    "text-pwip-gray-1000",
    "max-w-[24%]",
    "max-w-[76%]",
    "relative",
    "w-auto",
    "h-auto",
    "h-[36px]",
    "py-4",
    "bg-pwip-primary",
    "border-[1px]",
    "border-pwip-primary",
    "space-x-5",
    "text-white",
    "text-pwip-primary",
    "mt-4",
    "rounded-md",
    "top-[-12%]",
    "line-clamp-1",
    "border-l-[0px]",
    "text-center",
    "bg-green-800",
    "text-green-200",
    "z-[2000]",
    "bg-[#F3F7F9]",
    "bg-[#F7FFF2]",
    "bg-[#FFF5EF]",
    "bg-[#FFFBED]",
    "text-yellow-200",
    "bg-yellow-800",
    "bg-pwip-v2-gray-200",
    "z-[1000]",
    "from-[#2F3F74]",
    "to-[#537FE7]",
    "from-[#533D75]",
    "to-[#A97AE6]",
    "h-[27px]",
    "w-[6px]",
    "h-[6px]",
    "h-[47px]",
    "h-[32px]",
    "cols-span-10",
    "cols-span-2",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },

      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#FFFFFF",
        black: "#000",
        ...color,
      },
    },
    // colors: {
    //   transparent: "transparent",
    //   current: "currentColor",
    //   white: "#FFFFFF",
    //   black: "#000",
    //   ...color,
    // },
  },
  plugins: [],
};
