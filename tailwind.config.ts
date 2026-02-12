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
        sans: ['var(--font-plus-jakarta-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        dancing: ['var(--font-dancing-script)', 'cursive'],
      },
      colors: {
        felicis: {
          cream:  '#FAF7F2',
          peach:  '#F5EDE0',
          orange: '#C96824',
          text:   '#1C1917',
          muted:  '#6B5E52',
          border: '#E8DDD2',
        },
      },
    },
  },
  plugins: [],
}
export default config
