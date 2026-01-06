/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(230, 83%, 60%)',
          50: 'hsl(230, 83%, 97%)',
          100: 'hsl(230, 83%, 94%)',
          200: 'hsl(230, 83%, 86%)',
          300: 'hsl(230, 83%, 77%)',
          400: 'hsl(230, 83%, 68%)',
          500: 'hsl(230, 83%, 60%)',
          600: 'hsl(230, 83%, 52%)',
          700: 'hsl(230, 83%, 44%)',
          800: 'hsl(230, 83%, 36%)',
          900: 'hsl(230, 83%, 28%)',
          foreground: 'hsl(210, 40%, 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(210, 40%, 96%)',
          foreground: 'hsl(222.2, 84%, 4.9%)',
        },
        background: 'hsl(0, 0%, 100%)',
        foreground: 'hsl(222.2, 84%, 4.9%)',
        muted: {
          DEFAULT: 'hsl(210, 40%, 96%)',
          foreground: 'hsl(215.4, 16.3%, 46.9%)',
        },
        destructive: {
          DEFAULT: 'hsl(0, 84.2%, 60.2%)',
          foreground: 'hsl(210, 40%, 98%)',
        },
        border: 'hsl(214.3, 31.8%, 91.4%)',
        input: 'hsl(214.3, 31.8%, 91.4%)',
        ring: 'hsl(230, 83%, 60%)',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
};
