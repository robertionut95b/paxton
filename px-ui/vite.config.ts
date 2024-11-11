import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint2";
import tsconfigPaths from "vite-tsconfig-paths";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const ReactCompilerConfig = {
  target: "18",
  runtimeModule: "@/mycache",
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    tsconfigPaths(),
    eslint({
      cache: true,
    }),
    ckeditor5({ theme: require.resolve("@ckeditor/ckeditor5-theme-lark") }),
  ],
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
