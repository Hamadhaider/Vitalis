/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        ink: 'var(--color-ink)',
        line: 'var(--color-line)',
        surface: 'var(--color-surface)',
        pine: {
          DEFAULT: '#2F6F5E',
          light: '#4A8B77',
          dark: '#1E4B3F',
          50: '#EEF5F2',
        },
        amber: {
          DEFAULT: '#E0A855',
          light: '#F1CE96',
        },
        brick: {
          DEFAULT: '#BF5B44',
          light: '#F3DDD6',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        pulse_travel: {
          '0%': { strokeDashoffset: '400' },
          '100%': { strokeDashoffset: '0' },
        },
        fade_up: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulse_travel: 'pulse_travel 2.6s linear infinite',
        fade_up: 'fade_up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
