// run npm create vite@latest to generate this file
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      "lodash-es": "lodash-es",
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  plugins: [
    react(),
    nodePolyfills({
      // Some additional polyfills that might help with Semantic UI
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  // Add this to handle the specific error
  build: {
    rollupOptions: {
      external: ["lodash-es"],
    },
  },
});
