import { VitePWAOptions } from "vite-plugin-pwa";

export const manifestPlugin: Partial<VitePWAOptions> = {
  registerType: "prompt",
  includeAssets: ["favicon.svg", "apple-touch-icon.png", "maskable_icon.png"],
  manifest: {
    name: "What do your cheems?",
    short_name: "What do your cheems?",
    description: "What do your cheems?",
    icons: [
      {
        src: "/192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "/512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};
