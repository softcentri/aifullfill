import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          // 10% Accent (หมวดศรี - โชคลาภ การเงิน ค้าขายคล่อง)
          orange: "#F97316",
          "orange-hover": "#EA580C",
          "orange-light": "#FFEDD5",

          // 30% Secondary (หมวดมนตรี - ผู้ใหญ่เมตตา อุปถัมภ์ & ธาตุไม้ปีกระต่าย)
          emerald: "#10B981",
          "emerald-dark": "#059669",
          "emerald-light": "#D1FAE5",

          // 60% Base (หมวดเดช - อำนาจบารมี ลึกซึ้ง น่าเชื่อถือ)
          slate: "#0F172A",
          surface: "#1E293B",
          "surface-light": "#334155",
          "off-white": "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-prompt)", "sans-serif"],
      },
      borderRadius: {
        "udemy": "0.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
