import { defineConfig } from "vite";
import type { PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async ({ mode }) => {
  const plugins: PluginOption[] = [react()];
  const isReplit = Boolean(process.env.REPL_ID);

  if (isReplit && mode !== "production") {
    plugins.push(runtimeErrorOverlay());
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    const { devBanner } = await import("@replit/vite-plugin-dev-banner");
    plugins.push(cartographer(), devBanner());
  }

  const root = path.resolve(import.meta.dirname, "client");

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root,
    base: process.env.GITHUB_PAGES ? "/dev_projects_full-build2/" : "/",
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
    server: {
      proxy: {
        // Deterministic local integration:
        // - The frontend initializes session via GET `/health` (expects `x-session-id`)
        // - Roleplay flow requires coherent start/respond/session/end behavior on a single backend
        // Use the production parity API Worker for both `/health` and `/api/*`.
        "/health": {
          target: "https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev",
          changeOrigin: true,
          secure: true,
        },
        "/api": {
          target: "https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev",
          changeOrigin: true,
          secure: true,
        },
      },
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
