import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 7000,

    // ✅ Allow your custom domain
    allowedHosts: ["faisal8080.merinasib.shop"],

    // ✅ Required for external access
    host: true,
    cors: true,
  },
  build: {
    //   target: "esnext", // Ensure modern JavaScript syntax is used
    outDir: "dist", // Define your output directory for production build
  },
});
