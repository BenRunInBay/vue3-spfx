import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "webpart/src/webparts/assets",
    assetsDir: "appcode",
    minify: false,
    rollupOptions: {
      output: {
        generatedCode: {
          constBindings: false,
        },
      },
    },
  },
});
