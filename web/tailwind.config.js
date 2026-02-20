/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['attribute', '[data-theme="dark"]'], // ThemeManagerProvider
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        jost: ['Jost', 'sans-serif'],
      },
      colors: {
        // Usage: bg-theme-primary, border-theme-default...
        theme: {
          'bg-primary':    'var(--background-primary)',
          'bg-secondary':  'var(--background-secondary)',
          'bg-surface':    'var(--background-surface)',
          'bg-overlay':    'var(--background-overlay)',

          'text-primary':  'var(--text-primary)',
          'text-secondary':'var(--text-secondary)',
          'text-muted':    'var(--text-muted)',
          'text-inverse':  'var(--text-inverse)',

          'accent-blue':   'var(--accent-blue)',
          'accent-orange': 'var(--accent-orange)',

          'success':       'var(--status-success)',
          'warning':       'var(--status-warning)',
          'error':         'var(--status-error)',
          'info':          'var(--status-info)',

          'border':        'var(--border-default)',
          'border-subtle': 'var(--border-subtle)',
          'border-focus':  'var(--border-focus)',
        },
      },
      boxShadow: {
        'glow-blue':   '0 0 30px var(--accent-blue-glow)',
        'glow-purple': '0 0 30px var(--accent-purple-glow)',
      },
      backgroundImage: {
        'gradient-app': 'linear-gradient(135deg, var(--background-primary), var(--background-secondary))',
      },
    },
  },
  plugins: [],
};