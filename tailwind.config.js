export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          0: 'var(--s0)',
          1: 'var(--s1)',
          2: 'var(--s2)',
          3: 'var(--s3)',
          4: 'var(--s4)'
        },
        txt: {
          1: 'var(--t1)',
          2: 'var(--t2)',
          3: 'var(--t3)',
          inv: 'var(--t-inv)'
        },
        edge: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)'
        },
        d: {
          teal: '#14B8A6',
          coral: '#F97316',
          amber: '#fbbf24',
          emerald: '#34d399',
          violet: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        glow: '0 0 20px 4px var(--glow)'
      },
      keyframes: {
        'glow-pulse': {
          '0%,100%': { boxShadow: '0 0 8px 2px var(--glow)' },
          '50%': { boxShadow: '0 0 24px 6px var(--glow)' }
        }
      },
      animation: {
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite'
        }
    }
  },
  plugins: []
};