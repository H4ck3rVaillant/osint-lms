import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // En développement : proxy les appels /auth et /admin vers le backend local
  // → permet d'appeler fetch('/auth/login') au lieu de 'http://localhost:3000/auth/login'
  server: {
    port: 5173,
    proxy: {
      "/auth":  { target: "http://localhost:3000", changeOrigin: true },
      "/admin": { target: "http://localhost:3000", changeOrigin: true },
      "/health":{ target: "http://localhost:3000", changeOrigin: true },
    },
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Séparer les vendors pour un meilleur cache navigateur
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
