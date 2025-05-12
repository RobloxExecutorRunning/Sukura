
/** @type {import('tailwindcss').Config} */
module.exports = {
  // The content section defines where Tailwind should look for classes
  content: [
    "./**/*.{html,js,jsx,ts,tsx}", // Scans all HTML and JS/TS files in all directories
    "*.{js,ts,jsx,tsx,html}", // Scans root level files
  ],
  
  theme: {
    extend: {
      // Custom colors for Hulu-like interface
      colors: {
        'hulu-green': '#1ce783', // Hulu's signature green
        'hulu-dark': '#0b0c0f', // Very dark background
        'hulu-gray': '#272c34', // Dark gray for cards/sections
        'hulu-light-gray': '#3a3f47', // Lighter gray for hover states
        'hulu-text-gray': '#a8adb3', // Gray for secondary text
      },
      // Custom font sizes if needed
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      // Add custom spacing if needed
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      // Add custom border radius
      borderRadius: {
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
    },
  },
  
  // Add any Tailwind plugins you want to use
  plugins: [],
}
