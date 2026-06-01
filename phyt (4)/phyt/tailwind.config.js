/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#05060b',
          panel: '#0d101d',
          card: 'rgba(15, 18, 36, 0.4)',
          border: 'rgba(255, 255, 255, 0.05)',
          glowBorder: 'rgba(0, 240, 255, 0.15)',
        },
        neon: {
          blue: '#0072ff',
          cyan: '#00f0ff',
          green: '#10b981',
          yellow: '#f59e0b',
          rose: '#ef4444',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(0, 240, 255, 0.25)',
        'glow-blue': '0 0 15px rgba(0, 114, 255, 0.25)',
        'glow-rose': '0 0 15px rgba(239, 68, 68, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
