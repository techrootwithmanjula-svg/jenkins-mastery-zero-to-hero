import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  build: {
    // Route-level lazy loading (App.tsx) handles code splitting.
    // Avoid aggressive manualChunks — splitting node_modules across
    // multiple vendor chunks causes circular-dependency init errors at runtime
    // ("Cannot access 'X' before initialization").
  },
});
