/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        primary: '#000000',
        foreground: '#111111',
        accent: '#18181b',
        secondary: '#f4f4f5',
        border: '#e5e7eb',
      },
      boxShadow: {
        subtle: '0 2px 8px 0 rgba(0,0,0,0.06)',
        strong: '0 4px 24px 0 rgba(0,0,0,0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}; 