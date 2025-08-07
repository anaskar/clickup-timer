/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
  extend: {
    colors: {
      ink:   '#0B0E14',   // deep canvas
      panel: '#121722',   // surfaces
      ui: {
        purple: '#7B68EE',
        pink:   '#FD71AF',
        sky:    '#49CCF9',
        yellow: '#FFC800',
      }
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
    },
    dropShadow: {
      glow: '0 0 24px rgba(123,104,238,0.55)',
    }
  }
}
,
  plugins: [],
}
