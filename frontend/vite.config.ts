import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "motion-vendor": ["framer-motion"],
          "charts-vendor": ["recharts"],
          "carousel-vendor": ["embla-carousel-react", "embla-carousel-autoplay"],
          "icons-vendor": ["lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
