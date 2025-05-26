/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
import colors from 'tailwindcss/colors'
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        "bp_grayscale":{
          400:"#999999",
          500:"#505050",
          600:"#1F1F1F",
          700:"#323232",
          800:"#1A1A1A"
        },
        "bp_primary": {
          400: "#42A1FF", // Main Color
          50: "#E3F1FF",
          100: "#BBDCFF",
          200: "#90C7FF",
          300: "#63B1FF",
          500: "#2790FE",
          600: "#2A82EF",
          700: "#2970DB",
          800: "#285EC8",
          900: "#1F3286"
        },
        "bp_neutral": {
          900: "#030303", // Main color
          50: "#F7F7F7",
          100: "#E6E6E6",
          200: "#D9D9D9",
          300: "#BFBFBF",
          400: "#999999",
          500: "#737373",
          600: "#505050",
          700: "#030303",
          800: "#030303",
          950: "#141713"
        },

        "bp_danger": {
          DEFAULT: "#DA1E28",
          light: "#FFAAAA"
        },

        "bp_pink": {
          100: "#F80052"
        },

        "bp_green": {
          100: "#6AE156",
          400: "#33D160",
          500: "#24A148",
          600: "#268742"
        },
        "bp_yellow": {
          100: "#D9B655",
          200: "#A38D50",
          300: "#FFC91F"
        },
        "vtd-primary": colors.sky, // Light mode Datepicker color
        "vtd-secondary": {
          800: "#030303", // Main color
          50: "#F7F7F7",
          100: "#E6E6E6",
          200: "#D9D9D9",
          300: "#BFBFBF",
          400: "#999999",
          500: "#737373",
          600: "#505050",
          700: "#323232",
          900: "#1A1A1A"
        }, // Dark mode Datepicker color
      },
      fontSize: {
        xxs: '0.5rem',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
        blinkOpacity: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        twinkle: 'twinkle 1.2s ease-in-out infinite',
        blinkOpacity: 'blinkOpacity 1.6s ease-in-out infinite',
      },
    }
    },
  plugins: [
    daisyui
  ],
}