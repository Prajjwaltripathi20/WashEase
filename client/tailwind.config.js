/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#4F46E5', // Indigo 600
        secondary: '#10B981', // Emerald 500
        dark: '#1F2937', // Gray 800
        // New Premium Dark Theme Colors
        'navy-900': '#0B0F17',
        'navy-800': '#10141C',
        'navy-700': '#1A1F2E',
        'accent-blue': '#3B82F6', // Cool Blue
        'accent-teal': '#14B8A6', // Neon Teal
        'accent-violet': '#8B5CF6', // Electric Violet
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'soft': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'soft-dark': '0 10px 30px rgba(0, 0, 0, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.5)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.5)',
        'premium-card': '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
      },
      backdropFilter: {
        'glass': 'backdrop-filter: blur(4px)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-radial-center': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
