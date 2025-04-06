module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E293B", // Dark background
        secondary: "#334155", // Slightly lighter background
        accent: "#3B82F6", // Blue accent
        textPrimary: "#FFFFFF", // White text
        textSecondary: "#94A3B8", // Gray text
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
