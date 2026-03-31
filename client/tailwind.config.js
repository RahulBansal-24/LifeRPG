/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gaming-dark': '#0a0a0f',
        'gaming-darker': '#050508',
        'gaming-card': '#1a1a2e',
        'gaming-border': '#16213e',
        'neon-purple': '#8b5cf6',
        'neon-pink': '#ec4899',
        'neon-blue': '#3b82f6',
        'neon-green': '#10b981',
        'neon-yellow': '#f59e0b',
        'neon-cyan': '#06b6d4',
        'xp-gold': '#fbbf24',
        'level-purple': '#a855f7',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'level-up': 'levelUp 1s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #8b5cf6, 0 0 10px #8b5cf6' },
          '100%': { boxShadow: '0 0 20px #8b5cf6, 0 0 30px #8b5cf6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        levelUp: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '0.8' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gaming-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'neon-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #3b82f6 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(139, 92, 246, 0.5)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
        'neon-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'card-glow': '0 0 15px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [],
}
