import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'purple': {
          500: '#7C3AED',
          400: '#A78BFA',
        },
        'orange': {
          400: '#FB923C',
          300: '#FDBA74',
        },
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
        'gradient-orange': 'linear-gradient(135deg, #FB923C 0%, #FDBA74 100%)',
      },
    },
  },
  plugins: [],
}
export default config
