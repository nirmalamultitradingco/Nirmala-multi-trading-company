/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F4EC',
        ink: '#16241C',
        forest: '#234A34',
        moss: '#3E7A54',
        gold: '#C6912E',
        clay: '#B5754A',
        line: '#E3DECF',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        content: '1200px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(22,36,28,0.04), 0 12px 30px -18px rgba(22,36,28,0.25)',
      },
    },
  },
  plugins: [],
};
