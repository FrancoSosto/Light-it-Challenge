/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fondo: '#0b1220',
        panel: '#111827',
        borde: '#1f2a3c',
        acento: '#60a5fa',
        acentoSuave: '#93c5fd',
        texto: '#e5e7eb',
        mute: '#94a3b8',
      },
      boxShadow: {
        suave: '0 25px 50px -20px rgba(0, 0, 0, 0.55)',
        vidrio: '0 20px 45px -30px rgba(15, 23, 42, 0.8)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.99)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 400ms ease-out both',
        'scale-in': 'scaleIn 250ms ease-out both',
      },
    },
  },
  plugins: [],
};
