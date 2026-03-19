/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // GFTeam Brand — Brazil Flag inspired, dark & epic
        brand: {
          green: '#00B341',       // vibrant brazil green
          'green-dark': '#007A2F',
          'green-light': '#39D96B',
          gold: '#F5C500',        // brazil gold
          'gold-dark': '#C49B00',
          'gold-light': '#FFE14D',
          blue: '#003087',        // deep brazil blue
          'blue-light': '#0052CC',
        },
        // Dark UI system (Dynamic with CSS Variables)
        surface: {
          900: 'var(--bg-app)',
          800: 'var(--bg-sidebar)',
          700: 'var(--bg-card)',
          600: 'var(--bg-hover)',
          500: 'var(--border-app)',
          400: 'var(--accent)', // Use accent for high visibility hover
        },
        text: {
          primary: 'var(--text-main)',
          secondary: 'var(--text-dim)',
          muted: 'var(--text-dim)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'fade-up': 'fadeUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'badge-spin': 'spin 8s linear infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 8px 2px rgba(0,179,65,0.2)' },
          '100%': { boxShadow: '0 0 20px 6px rgba(0,179,65,0.5)' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,179,65,0.2), transparent)',
      },
    },
  },
  plugins: [],
}
