/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,vue}"],
  theme: {
    extend: {
      colors: {
        'tp-bg': {
          primary: 'var(--tp-bg-primary)',
          secondary: 'var(--tp-bg-secondary)',
          tertiary: 'var(--tp-bg-tertiary)',
        },
        'tp-text': {
          primary: 'var(--tp-text-primary)',
          secondary: 'var(--tp-text-secondary)',
          muted: 'var(--tp-text-muted)',
        },
        'tp-accent': {
          DEFAULT: 'var(--tp-accent)',
          dim: 'var(--tp-accent-dim)',
          glow: 'var(--tp-accent-glow)',
        },
        'tp-border': {
          DEFAULT: 'var(--tp-border)',
          strong: 'var(--tp-border-strong)',
        },
        'tp-rule': 'var(--tp-rule)',
        'tp-error': {
          DEFAULT: 'var(--tp-error)',
          bg: 'var(--tp-error-bg)',
        },
        'tp-success': 'var(--tp-success)',
        'tp-warning': 'var(--tp-warning)',
      },
      fontFamily: {
        sans: ['var(--tp-font-sans)'],
        mono: ['var(--tp-font-mono)'],
      },
      fontSize: {
        'tp-xs': 'var(--tp-text-xs)',
        'tp-sm': 'var(--tp-text-sm)',
        'tp-base': 'var(--tp-text-base)',
        'tp-lg': 'var(--tp-text-lg)',
        'tp-xl': 'var(--tp-text-xl)',
        'tp-2xl': 'var(--tp-text-2xl)',
        'tp-hero': ['var(--tp-text-hero)', { lineHeight: '1.1' }],
      },
      spacing: {
        'tp-1': 'var(--tp-space-1)',
        'tp-2': 'var(--tp-space-2)',
        'tp-3': 'var(--tp-space-3)',
        'tp-4': 'var(--tp-space-4)',
        'tp-6': 'var(--tp-space-6)',
        'tp-8': 'var(--tp-space-8)',
        'tp-12': 'var(--tp-space-12)',
        'tp-16': 'var(--tp-space-16)',
        'tp-24': 'var(--tp-space-24)',
        'tp-32': 'var(--tp-space-32)',
        'tp-48': 'var(--tp-space-48)',
      },
      borderRadius: {
        'tp-sm': 'var(--tp-radius-sm)',
        'tp-base': 'var(--tp-radius-base)',
      },
      borderWidth: {
        'tp': 'var(--tp-border-width)',
        'tp-thick': 'var(--tp-border-width-thick)',
      },
      transitionDuration: {
        'tp-fast': '150ms',
        'tp-base': '250ms',
        'tp-slow': '400ms',
      },
      maxWidth: {
        'tp-container': 'var(--tp-container-max)',
        'tp-content': 'var(--tp-content-max)',
      },
      zIndex: {
        'tp-dropdown': 'var(--tp-z-dropdown)',
        'tp-sticky': 'var(--tp-z-sticky)',
        'tp-modal': 'var(--tp-z-modal)',
        'tp-tooltip': 'var(--tp-z-tooltip)',
        'tp-toast': 'var(--tp-z-toast)',
      },
      lineHeight: {
        'tp-tight': 'var(--tp-leading-tight)',
        'tp-normal': 'var(--tp-leading-normal)',
        'tp-relaxed': 'var(--tp-leading-relaxed)',
      },
      letterSpacing: {
        'tp-tight': 'var(--tp-tracking-tight)',
        'tp-normal': 'var(--tp-tracking-normal)',
        'tp-wide': 'var(--tp-tracking-wide)',
        'tp-mono': 'var(--tp-tracking-mono)',
      },
    },
  },
  plugins: [],
}
