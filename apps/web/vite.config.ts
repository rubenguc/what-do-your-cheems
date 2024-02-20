import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import million from "million/compiler";
// import { VitePWA } from "vite-plugin-pwa";
// import { manifestPlugin } from "./src/manifest";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    // VitePWA(manifestPlugin)
  ],

  server: {
    port: 4200,
    host: true,
  },
});
