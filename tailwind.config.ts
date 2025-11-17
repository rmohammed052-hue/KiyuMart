import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    // Order Status Colors
    'bg-amber-50', 'text-amber-700', 'border-amber-200', 'dark:bg-amber-950/30', 'dark:text-amber-400', 'dark:border-amber-800', 'bg-amber-500', 'bg-amber-600',
    'bg-sky-50', 'text-sky-700', 'border-sky-200', 'dark:bg-sky-950/30', 'dark:text-sky-400', 'dark:border-sky-800', 'bg-sky-500',
    'bg-violet-50', 'text-violet-700', 'border-violet-200', 'dark:bg-violet-950/30', 'dark:text-violet-400', 'dark:border-violet-800', 'bg-violet-500',
    'bg-emerald-50', 'text-emerald-700', 'border-emerald-200', 'dark:bg-emerald-950/30', 'dark:text-emerald-400', 'dark:border-emerald-800', 'bg-emerald-500', 'bg-emerald-600',
    'bg-rose-50', 'text-rose-700', 'border-rose-200', 'dark:bg-rose-950/30', 'dark:text-rose-400', 'dark:border-rose-800', 'bg-rose-500',
    'bg-orange-50', 'text-orange-700', 'border-orange-200', 'dark:bg-orange-950/30', 'dark:text-orange-400', 'dark:border-orange-800', 'bg-orange-500',
    'bg-indigo-50', 'text-indigo-700', 'border-indigo-200', 'dark:bg-indigo-950/30', 'dark:text-indigo-400', 'dark:border-indigo-800', 'bg-indigo-500',
    // User Role Colors
    'bg-slate-50', 'text-slate-700', 'border-slate-300', 'dark:bg-slate-900/50', 'dark:text-slate-300', 'dark:border-slate-700', 'bg-slate-700',
    'bg-purple-50', 'text-purple-700', 'border-purple-200', 'dark:bg-purple-950/30', 'dark:text-purple-400', 'dark:border-purple-800', 'bg-purple-500', 'bg-purple-600',
    'bg-blue-50', 'text-blue-700', 'border-blue-200', 'dark:bg-blue-950/30', 'dark:text-blue-400', 'dark:border-blue-800', 'bg-blue-500', 'bg-blue-600',
    'bg-teal-50', 'text-teal-700', 'border-teal-200', 'dark:bg-teal-950/30', 'dark:text-teal-400', 'dark:border-teal-800', 'bg-teal-600',
    'bg-pink-50', 'text-pink-700', 'border-pink-200', 'dark:bg-pink-950/30', 'dark:text-pink-400', 'dark:border-pink-800', 'bg-pink-600',
    // Payment & Other Status Colors
    'bg-gray-50', 'text-gray-700', 'border-gray-200', 'dark:bg-gray-900/50', 'dark:text-gray-400', 'dark:border-gray-700', 'bg-gray-500',
    'bg-green-50', 'text-green-700', 'border-green-200', 'dark:bg-green-950/30', 'dark:text-green-400', 'dark:border-green-800', 'bg-green-600',
    'bg-red-50', 'text-red-700', 'border-red-200', 'dark:bg-red-950/30', 'dark:text-red-400', 'dark:border-red-800', 'bg-red-500',
    'text-white',
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: ".5625rem", /* 9px */
        md: ".375rem", /* 6px */
        sm: ".1875rem", /* 3px */
      },
      colors: {
        // Flat / base colors (regular buttons)
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          border: "hsl(var(--card-border) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          border: "hsl(var(--popover-border) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          border: "var(--primary-border)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          border: "var(--secondary-border)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
          border: "var(--muted-border)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          border: "var(--accent-border)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          border: "var(--destructive-border)",
        },
        ring: "hsl(var(--ring) / <alpha-value>)",
        chart: {
          "1": "hsl(var(--chart-1) / <alpha-value>)",
          "2": "hsl(var(--chart-2) / <alpha-value>)",
          "3": "hsl(var(--chart-3) / <alpha-value>)",
          "4": "hsl(var(--chart-4) / <alpha-value>)",
          "5": "hsl(var(--chart-5) / <alpha-value>)",
        },
        sidebar: {
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
        },
        "sidebar-primary": {
          DEFAULT: "hsl(var(--sidebar-primary) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          border: "var(--sidebar-primary-border)",
        },
        "sidebar-accent": {
          DEFAULT: "hsl(var(--sidebar-accent) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "var(--sidebar-accent-border)"
        },
        status: {
          online: "rgb(34 197 94)",
          away: "rgb(245 158 11)",
          busy: "rgb(239 68 68)",
          offline: "rgb(156 163 175)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
