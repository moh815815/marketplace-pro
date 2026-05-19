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
        navy: {
          DEFAULT: '#0A1628',
          2: '#0F1F3D',
          3: '#162847',
          4: '#1E3356',
        },
        gold: {
          DEFAULT: '#D4A843',
          2: '#E8C070',
          3: '#F0D090',
        },
        brand: {
          orange: '#E8692A',
          orange2: '#F07840',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4A843, #E8692A)',
        'navy-gradient': 'linear-gradient(135deg, #0F1F3D, #162847)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideRight: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
