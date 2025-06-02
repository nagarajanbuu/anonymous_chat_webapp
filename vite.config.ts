import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 8080,
    host: true,
    allowedHosts: [
      'professional-cutting-scroll-relationship.trycloudflare.com', // Allow Cloudflare tunnel host
      'localhost', // Localhost for development
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
