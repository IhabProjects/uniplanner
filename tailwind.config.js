/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'notion-text': '#37352f',
        'notion-light-text': '#787774',
        'notion-background': '#ffffff',
        'notion-hover': '#f5f5f5',
        'notion-border': '#e5e5e5',
        'notion-primary': '#2eaadc',
        'notion-sidebar': '#fbfbfa',
        'notion-sidebar-hover': '#efefef',
        'notion-selection': '#d3e5ff'
      },
      fontFamily: {
        notion: ['ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Apple Color Emoji', 'Arial', 'sans-serif', 'Segoe UI Emoji', 'Segoe UI Symbol']
      }
    }
  },
  plugins: []
}
