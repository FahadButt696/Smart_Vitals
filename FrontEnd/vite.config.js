import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"; // Add this

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Add this
    },
    extend: {
  animation: {
    fadeInUp: 'fadeInUp 0.5s ease-out both',
    fadeIn: 'fadeIn 0.8s ease-out both',
  },
  keyframes: {
    fadeInUp: {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  },
}
  },
})
