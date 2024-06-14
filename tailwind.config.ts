import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      colors: {
        bme: {
          100: '#e9d0d6',
          200: '#d4a2ae',
          300: '#be7385',
          400: '#a9455d',
          500: '#931634',
          600: '#76122a',
          700: '#580d1f',
          800: '#3b0915',
          900: '#1d040a',
        },
        primary: {
          50: 'var(--color-primary-50, #f6f9fc)',
          100: 'var(--color-primary-100, #d0d8e0)',
          200: 'var(--color-primary-200, #a2b1c2)',
          300: 'var(--color-primary-300, #7389a3)',
          400: 'var(--color-primary-400, #456285)',
          500: 'var(--color-primary-500, #163b66)',
          600: 'var(--color-primary-600, #122f52)',
          700: 'var(--color-primary-700, #0d233d)',
          800: 'var(--color-primary-800, #091829)',
          900: 'var(--color-primary-900, #040c14)',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
