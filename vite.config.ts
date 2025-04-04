import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/1inch": {
        target: "https://api.1inch.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/1inch/, ""),
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log(
              "Sending Request to the Target:",
              req.method,
              options.target + proxyReq.path
            );
          });

          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log(
              "Receiving Response from the Target:",
              req.method,
              options.target + req.url
            );
          });

          proxy.on("error", (err, req, res) => {
            console.log("Error Occurred:", err);
          });
        },
      },
    },
  },
});
