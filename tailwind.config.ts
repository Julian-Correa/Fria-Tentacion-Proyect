import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#d8ebff',
          200: '#b8dcff',
          300: '#89c5ff',
          400: '#4ca4ff',
          500: '#177ff0',
          600: '#0c64d0',
          700: '#0e50a8',
          800: '#124487',
          900: '#16396f',
          950: '#0f2548',
        },
      },
      boxShadow: {
        glow: '0 18px 60px rgba(23, 127, 240, 0.18)',
      },
      backgroundImage: {
        aurora:
          'radial-gradient(circle at top, rgba(76,164,255,0.2), transparent 40%), radial-gradient(circle at bottom right, rgba(184,220,255,0.18), transparent 30%)',
      },
    },
  },
  plugins: [],
} satisfies Config
