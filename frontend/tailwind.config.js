/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50:   '#f8f8f6',
          100:  '#f0efed',
          150:  '#e8e6e2',
          200:  '#d8d5d0',
          300:  '#b8b3ac',
          400:  '#908b83',
          500:  '#6b665e',
          600:  '#4e4a43',
          700:  '#373330',
          800:  '#28241f',
          900:  '#1c1915',
          950:  '#141210',
          1000: '#0a0a08',
        },
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.05)',
        lift: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
