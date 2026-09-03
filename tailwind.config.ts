import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "accent-blue": "var(--accent-blue)",
        "accent-emerald": "var(--accent-emerald)",
        "accent-purple": "var(--accent-purple)",
      },
      fontFamily: {
        bagel: ['"Bagel Fat One"', "ui-rounded", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 20px 70px rgba(15, 23, 42, 0.12)",
        lift: "0 16px 45px rgba(37, 99, 235, 0.16)",
      },
    },
  },
  plugins: [],
} satisfies Config;
