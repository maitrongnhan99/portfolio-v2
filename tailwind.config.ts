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
        borderLight: "var(--border-light)",
        borderSubtle: "var(--border-subtle)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        canvas: {
          white: "hsl(var(--canvas-white))",
          light: "hsl(var(--canvas-light))",
          near: "hsl(var(--canvas-near))",
          warm: "hsl(var(--canvas-warm))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          muted: "hsl(var(--text-muted))",
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
        "inset-border": "var(--shadow-inset-border)",
        "inset-dark": "var(--shadow-inset-border)",
        "outline-ring": "var(--shadow-outline-ring)",
        card: "var(--shadow-card)",
        "warm-lift": "var(--shadow-warm-lift)",
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
        display: ["var(--font-waldenburg)", "var(--font-inter)", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "var(--font-mono)", "monospace"],
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
