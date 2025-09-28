/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./{components,screens,context,services}/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Press Start 2P"', 'monospace'],
        mono: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        background: {
          dark: '#080812',
          light: '#F3F4F6',
        },
        surface: {
          dark: '#111111',
          light: '#FFFFFF',
        },
        text: {
          dark: '#E5E7EB',
          light: '#1F2937',
        },
        muted: {
          dark: '#6B7280',
          light: '#6B7280',
        },
        primary: {
          DEFAULT: '#0AF', // Electric Cyan
          light: '#67E8F9',
          dark: '#08D',
        },
        secondary: {
          DEFAULT: '#EC4899',
          light: '#F472B6',
          dark: '#D946EF',
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s infinite ease-in-out',
        'line-flow': 'line-flow 5s linear infinite',
        'fade-in': 'fade-in 0.3s steps(6, end) forwards',
        'launch-effect': 'launch-effect 0.7s ease-out forwards',
        'pulse-orbit': 'pulse-orbit 5s infinite ease-in-out',
        'scanline': 'scanline 10s linear infinite',
        'pulse-mission': 'pulse-mission 2.5s infinite ease-in-out',
        'path-flow': 'path-flow 3s ease-in-out infinite',
        'energy-bar': 'energy-bar 1s steps(10, end) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        'pulse-mission': {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1) drop-shadow(0 0 0px #67E8F9)' },
          '50%': { transform: 'scale(1.05)', filter: 'brightness(1.2) drop-shadow(0 0 8px #67E8F9)' },
        },
        'path-flow': {
          '0%': { transform: 'translateY(-101%)' },
          '100%': { transform: 'translateY(101%)' },
        },
        'line-flow': {
          '0%': { 'stroke-dashoffset': 20 },
          '100%': { 'stroke-dashoffset': 0 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'launch-effect': {
          '0%': { opacity: 0, transform: 'scale(0) rotate(45deg)' },
          '100%': { opacity: 1, transform: 'scale(0.6) rotate(45deg)' },
        },
        'pulse-orbit': {
          '0%, 100%': { 'stroke-opacity': 0.1 },
          '50%': { 'stroke-opacity': 0.4 },
        },
        'scanline': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100px' },
        },
        'energy-bar': {
          '0%': { 'background-position': '0 0' },
          '100%': { 'background-position': '-20px 0' },
        }
      }
    },
  },
  plugins: [],
}