/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F0F0F',
        soot: '#151515',
        crimson: '#E63946',
        gold: '#FFB703',
        bone: '#F1FAEE',
        jade: '#2A9D8F',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        japanese: ['"Noto Serif JP"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        chunky: ['"Fredoka One"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'noise':
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")",
        'asanoha':
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='104' viewBox='0 0 60 104'><g fill='none' stroke='%23E63946' stroke-opacity='0.06' stroke-width='1'><path d='M30 0 L60 17.3 L60 51.9 L30 69.2 L0 51.9 L0 17.3 Z'/><path d='M30 0 L30 69.2 M0 17.3 L60 51.9 M60 17.3 L0 51.9'/></g></svg>\")",
        'radial-glow':
          'radial-gradient(circle at center, rgba(230,57,70,0.18) 0%, rgba(15,15,15,0) 60%)',
      },
      boxShadow: {
        neon: '0 0 20px rgba(230,57,70,0.55), 0 0 40px rgba(230,57,70,0.25)',
        'neon-gold': '0 0 20px rgba(255,183,3,0.55), 0 0 40px rgba(255,183,3,0.25)',
        'neon-jade': '0 0 18px rgba(42,157,143,0.5), 0 0 36px rgba(42,157,143,0.2)',
        lantern: '0 0 60px rgba(255,183,3,0.35), inset 0 -10px 30px rgba(230,57,70,0.4)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '41.99%': { opacity: 1 },
          '42%': { opacity: 0 },
          '43%': { opacity: 1 },
          '47%': { opacity: 1 },
          '47.5%': { opacity: 0.4 },
          '48%': { opacity: 1 },
        },
        steam: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: 0 },
          '20%': { opacity: 0.5 },
          '100%': { transform: 'translateY(-200px) scale(1.8)', opacity: 0 },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(230,57,70,0.7))' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(230,57,70,1))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        flicker: 'flicker 3s infinite',
        steam: 'steam 4s ease-out infinite',
        sway: 'sway 6s ease-in-out infinite',
        scroll: 'scroll 40s linear infinite',
        glow: 'glow 2.5s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};
