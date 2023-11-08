import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import million from "million/compiler";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), million.vite({ auto: true })],

  server: {
    port: 4200,
    host: true,
  },
  optimizeDeps: {
    include: ["react/jsx-runtime", "react", "react-dom"],
  },
});
