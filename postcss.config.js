
module.exports = {
  plugins: {
    // Tailwind CSS
    tailwindcss: {},
    
    // Autoprefixer adds vendor prefixes to CSS rules
    autoprefixer: {
      // You can specify browser targets if needed
      // browsers: ['last 2 versions', '> 1%']
    },
    
    // Optional: Add cssnano for production to minify CSS
    ...(process.env.NODE_ENV === 'production' ? { 'cssnano': {} } : {})
  }
}
