/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Duolingo Dark Palette
        primary: '#131f24',       // Main background (very dark teal)
        'primary-light': '#1a2d35', // Slightly lighter
        'primary-card': '#1e3a44',  // Card surfaces
        surface: '#233d47',       // Elevated surfaces

        // Duolingo Accent Colors
        duo: {
          green: '#58cc02',       // Primary green (Duolingo signature)
          'green-dark': '#4CAD00',
          blue: '#1cb0f6',        // Info/accent blue
          'blue-dark': '#1899D6',
          red: '#ff4b4b',         // Error red
          'red-dark': '#E5443D',
          yellow: '#ffc800',      // Warning/gold
          'yellow-dark': '#E5B800',
          purple: '#ce82ff',      // Bonus purple
          orange: '#ff9600',      // Streak orange
        },

        // Answer buttons (brighter for dark bg)
        answerA: '#ff4b4b',  // Red
        answerB: '#1cb0f6',  // Blue
        answerC: '#ffc800',  // Yellow
        answerD: '#58cc02',  // Green

        correct: '#58cc02',
        wrong: '#ff4b4b',
        timeout: '#ff9600',
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'duo': '16px',    // Duolingo rounded corners
        'duo-lg': '20px', // Larger cards
      },
      boxShadow: {
        'duo': '0 4px 0 0 rgba(0,0,0,0.2)',         // 3D button shadow
        'duo-green': '0 4px 0 0 #4CAD00',
        'duo-blue': '0 4px 0 0 #1899D6',
        'duo-red': '0 4px 0 0 #E5443D',
        'duo-card': '0 2px 8px 0 rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
