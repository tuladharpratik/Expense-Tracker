import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        lufga: ['var(--font-lufga)', 'sans-serif'], // Custom font family
      },
      fontWeight: {
        regular: '400',
        medium: '500',
      },
      colors: {
        primary: {
          1000: '#0D1B1E',
          900: '#124E50',
          800: '#15706D',
          700: '#19908A',
          600: '#1CAAA4',
          500: '#42CFC0',
          400: '#72E4D9',
          300: '#A3F1E8',
          200: '#D2FBF5',
          100: '#EDFFFE',
        },
          1000: '#0D1B1E',
          900: '#124E50',
          800: '#15706D',
          700: '#19908A',
          600: '#1CAAA4',
          500: '#42CFC0',
          400: '#72E4D9',
          300: '#A3F1E8',
          200: '#D2FBF5',
          100: '#EDFFFE',
        },        
        neutral: {
          900: '#111113',
          800: '#222226',
          700: '#343438',
          600: '#45454B',
          500: '#56565E',
          400: '#82828C',
          300: '#A1A1A9',
          200: '#D0D0D4',
          100: '#EFEFF1',
        },
        black: '#000000',
        white: '#FFFFFF',
        warning: {
          500: '#F9970C',
          200: '#FEF4E1',
        },
        success: {
          800: '#297B32',
          200: '#E5FAE6',
        },
        danger: {
          500: '#E83838',
          200: '#FFEBEB',
        },
      },
    },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate')],
}

export default config;
