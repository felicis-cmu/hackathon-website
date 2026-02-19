import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        instrument: ['var(--font-instrument)', 'Georgia', 'serif'],
      },
      colors: {
        'felicis-orange':       '#ED843D',
        'felicis-orange-light': '#FFA451',
        'felicis-cream':        '#FAF8F4',
        'felicis-surface':      '#F3F0EB',
        'felicis-text':         '#0F1923',
        'felicis-muted':        '#78716C',
        'felicis-border':       '#EAE7E2',
        'felicis-card':         '#FFFEFB',
      },
    },
  },
  plugins: [],
}

export default config
