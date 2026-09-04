/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mining: {
          bg: '#05050A',
          card: '#0D111A',
          cardHover: '#131926',
          border: '#1E293B',
          accent: '#00E5FF',
          safe: '#00E676',
          warning: '#FFB300',
          danger: '#FF1744',
          muted: '#64748B',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'strobe-fast': 'strobe 0.4s infinite alternate',
        'radar-spin': 'radarSpin 4s linear infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        strobe: {
          '0%': { opacity: '1', filter: 'drop-shadow(0 0 15px #FF1744)' },
          '100%': { opacity: '0.3', filter: 'drop-shadow(0 0 2px #FF1744)' },
        },
        radarSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 229, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 229, 255, 0.7)' },
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
