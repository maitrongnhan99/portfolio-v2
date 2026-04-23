import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        borderLight: "#e5e5e5",
        borderSubtle: "rgba(0, 0, 0, 0.05)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        canvas: {
          white: "#ffffff",
          light: "#f5f5f5",
          near: "#f6f6f6",
          warm: "#f5f2ef",
        },
        text: {
          primary: "#000000",
          secondary: "#4e4e4e",
          muted: "#777169",
        },

        navy: {
          DEFAULT: "#0b192f",
          light: "#112240",
          lighter: "#233554",
        },
        slate: {
          DEFAULT: "#8892b0",
          light: "#a8b2d1",
          lighter: "#ccd6f6",
        },
        aqua: {
          DEFAULT: "#64ffda",
        },
        primary: {
          DEFAULT: "rgb(6, 182, 212, 1)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#1e293b",
          foreground: "#94a3b8",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xs: "2px",
        nav: "4px",
        base: "8px",
        comfortable: "12px",
        card: "16px",
        featured: "20px",
        section: "24px",
        warm: "30px",
        pill: "9999px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "inset-border": "inset 0 0 0 0.5px rgba(0, 0, 0, 0.075)",
        "inset-dark": "inset 0 0 0 0.5px rgba(0, 0, 0, 0.1)",
        "outline-ring":
          "0 0 0 1px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.04)",
        card: "0 0 1px rgba(0, 0, 0, 0.4), 0 4px 4px rgba(0, 0, 0, 0.04)",
        "warm-lift": "0 6px 16px rgba(78, 50, 23, 0.04)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(10%,20%) scale(1)",
          },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        "meteor-effect": "meteor 5s linear infinite",
      },
      fontFamily: {
        display: ["var(--font-inter)", "Inter", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-hero": [
          "3rem",
          { lineHeight: "1.08", letterSpacing: "-0.96px", fontWeight: "300" },
        ],
        "display-section": ["2.25rem", { lineHeight: "1.17", fontWeight: "300" }],
        "display-card": ["2rem", { lineHeight: "1.13", fontWeight: "300" }],
        "body-lg": ["1.25rem", { lineHeight: "1.35" }],
      },
      letterSpacing: {
        body: "0.16px",
        "body-relaxed": "0.18px",
        caption: "0.14px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
