/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  // safelist: [
  //   "w-[calc(100%/3)]",
  //   "min-h-[100px]",
  //   "ring-gray-200",
  //   "rounded-md",
  //   "space-x-6",
  //   "p-2",
  //   "transition-all",
  //   "scale-105",
  //   "bg-white",
  // ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Gilroy','arial'],
        'serif': ['DM-sans'],
      },
    },
  },
  plugins: [],
};
