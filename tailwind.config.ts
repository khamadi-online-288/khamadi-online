import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:  '#1B3A6B',
        sky:   '#1B8FC4',
        mid:   '#2E5FA3',
        gold:  '#C9933B',
        light: '#EBF0F8',
        main:  '#F5F9FD',
        soft:  '#EBF5FB',
      },
      fontFamily: {
        sans:  ['Montserrat', 'sans-serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
