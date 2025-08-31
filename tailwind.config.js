/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563EB', // Deep blue (primary) - blue-600
        'primary-50': '#EFF6FF', // Very light blue - blue-50
        'primary-100': '#DBEAFE', // Light blue - blue-100
        'primary-500': '#3B82F6', // Medium blue - blue-500
        'primary-700': '#1D4ED8', // Dark blue - blue-700
        'primary-900': '#1E3A8A', // Very dark blue - blue-900

        // Secondary Colors
        'secondary': '#64748B', // Sophisticated slate gray - slate-500
        'secondary-50': '#F8FAFC', // Very light slate - slate-50
        'secondary-100': '#F1F5F9', // Light slate - slate-100
        'secondary-200': '#E2E8F0', // Light slate - slate-200
        'secondary-300': '#CBD5E1', // Medium light slate - slate-300
        'secondary-400': '#94A3B8', // Medium slate - slate-400
        'secondary-600': '#475569', // Medium dark slate - slate-600
        'secondary-700': '#334155', // Dark slate - slate-700
        'secondary-800': '#1E293B', // Very dark slate - slate-800
        'secondary-900': '#0F172A', // Near black slate - slate-900

        // Accent Colors
        'accent': '#0EA5E9', // Bright cyan blue - sky-500
        'accent-50': '#F0F9FF', // Very light sky - sky-50
        'accent-100': '#E0F2FE', // Light sky - sky-100
        'accent-200': '#BAE6FD', // Light sky - sky-200
        'accent-600': '#0284C7', // Medium dark sky - sky-600
        'accent-700': '#0369A1', // Dark sky - sky-700

        // Background Colors
        'background': '#F8FAFC', // Soft off-white - slate-50
        'surface': '#FFFFFF', // Pure white - white

        // Text Colors
        'text-primary': '#0F172A', // Near-black with blue undertone - slate-900
        'text-secondary': '#475569', // Medium gray - slate-600
        'text-tertiary': '#64748B', // Light gray - slate-500

        // Status Colors
        'success': '#059669', // Professional green - emerald-600
        'success-50': '#ECFDF5', // Very light emerald - emerald-50
        'success-100': '#D1FAE5', // Light emerald - emerald-100
        'success-500': '#10B981', // Medium emerald - emerald-500

        'warning': '#D97706', // Warm amber - amber-600
        'warning-50': '#FFFBEB', // Very light amber - amber-50
        'warning-100': '#FEF3C7', // Light amber - amber-100
        'warning-500': '#F59E0B', // Medium amber - amber-500

        'error': '#DC2626', // Clear red - red-600
        'error-50': '#FEF2F2', // Very light red - red-50
        'error-100': '#FEE2E2', // Light red - red-100
        'error-500': '#EF4444', // Medium red - red-500

        // Border Colors
        'border': '#E2E8F0', // Neutral border - slate-200
        'border-light': '#F1F5F9', // Light border - slate-100
        'border-dark': '#CBD5E1', // Dark border - slate-300
      },
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'caption': ['Inter', 'system-ui', 'sans-serif'],
        'data': ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      fontWeight: {
        'heading-normal': '400',
        'heading-medium': '500',
        'heading-semibold': '600',
        'body-normal': '400',
        'body-medium': '500',
        'caption-normal': '400',
        'data-normal': '400',
      },
      borderRadius: {
        'DEFAULT': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        'header': '1000',
        'toolbar': '900',
        'dropdown': '1100',
        'modal': '1200',
        'tooltip': '1300',
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slide-in 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fade-in 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}