/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        bangla: ['LEAdorNoirritBold', 'sans-serif'],
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      colors: {
        base: {
          light: '#eef1f5',
          dark: '#1a1d24',
        },
        surface: {
          light: '#eef1f5',
          dark: '#22262f',
        },
      },
      boxShadow: {
        'neo-light': '8px 8px 16px #c8ccd1, -8px -8px 16px #ffffff',
        'neo-light-sm': '4px 4px 8px #c8ccd1, -4px -4px 8px #ffffff',
        'neo-light-inset': 'inset 4px 4px 8px #c8ccd1, inset -4px -4px 8px #ffffff',
        'neo-dark': '8px 8px 16px #14161b, -8px -8px 16px #20242d',
        'neo-dark-sm': '4px 4px 8px #14161b, -4px -4px 8px #20242d',
        'neo-dark-inset': 'inset 4px 4px 8px #14161b, inset -4px -4px 8px #20242d',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      backdropBlur: {
        glass: '12px',
      },
      borderRadius: {
        neo: '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pop': 'pop 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
