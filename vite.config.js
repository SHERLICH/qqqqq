import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const viteAppRoot = fileURLToPath(new URL("vite-app", import.meta.url));

export default defineConfig({
  root: viteAppRoot,
  plugins: [react()],
  publicDir: false,
  resolve: {
    alias: {
      "@": resolve(projectRoot, "src"),
    },
  },
  server: {
    fs: {
      allow: [projectRoot, viteAppRoot],
    },
  },
  build: {
    outDir: resolve(projectRoot, "dist"),
    emptyOutDir: true,
  },
});
