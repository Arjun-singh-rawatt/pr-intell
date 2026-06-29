/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: 'var(--color-ink)',
        shell: 'var(--color-shell)',
        sidebar: 'var(--color-sidebar)',
        surface: 'var(--color-surface)',
        panel: 'var(--color-panel)',
        nested: 'var(--color-nested)',
        panel2: 'var(--color-panel2)',
        recessed: 'var(--color-recessed)',
        active: 'var(--color-active)',
        line: 'var(--color-line)',
        soft: 'var(--color-soft)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        accent2: 'var(--color-accent2)',
        success: 'var(--color-success)',
        warn: 'var(--color-warn)',
        violet: 'var(--color-violet)',
        blue: 'var(--color-blue)',
        red: 'var(--color-red)',
        cta: 'var(--color-cta)',
        'cta-ink': 'var(--color-cta-ink)',
      },
      borderRadius: {
        card: '12px',
        panel: '16px',
      },
      boxShadow: {
        glow: 'none',
      },
      animation: {
        rise: 'rise 220ms ease-out',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
