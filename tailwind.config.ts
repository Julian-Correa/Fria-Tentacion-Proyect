import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0feff',
          100: '#d6fbff',
          200: '#b6ffff',
          300: '#7ef0ff',
          400: '#40cfff',
          500: '#1ab3e0',
          600: '#0e8fb8',
          700: '#0f7294',
          800: '#145d78',
          900: '#164e63',
          950: '#093347',
        },
      },
      boxShadow: {
        glow: '0 18px 60px rgba(64, 207, 255, 0.18)',
      },
      backgroundImage: {
        aurora:
          'radial-gradient(circle at top, rgba(64,207,255,0.15), transparent 40%), radial-gradient(circle at bottom right, rgba(182,255,255,0.12), transparent 30%)',
      },
    },
  },
  plugins: [],
} satisfies Config
