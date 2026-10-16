/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Grant Thornton Bharat palette
        gt: {
          purple: "#4E2A84",
          "purple-dark": "#3B1F63",
          "purple-light": "#7B5AA6",
          teal: "#00A9A5",
          "teal-dark": "#007E7B",
          "teal-light": "#4FC7C3",
        },
        ink: "#1A1523",
        muted: "#6B6478",
        surface: "#F7F5FB",
        card: "#FFFFFF",
        border: "#E7E2F0",
        good: "#16A34A",
        warn: "#D97706",
        bad: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(26,21,35,0.06), 0 1px 2px rgba(26,21,35,0.04)",
        cardhover: "0 8px 24px rgba(78,42,132,0.12)",
      },
    },
  },
  plugins: [],
};
