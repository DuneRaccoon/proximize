/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          light: '#60a5fa',
        },
        secondary: {
          DEFAULT: '#6b7280',
          dark: '#4b5563',
          light: '#9ca3af',
        },
        success: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#34d399',
        },
        danger: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
          light: '#f87171',
        },
        warning: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          light: '#fbbf24',
        },
        info: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          light: '#60a5fa',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'inner-sm': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}