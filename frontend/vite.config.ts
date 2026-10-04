// SPDX-License-Identifier: MPL-2.0

import fs from "node:fs";
import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8"),
) as { version: string };

const appVersion = process.env.APP_VERSION ?? packageJson.version;

export default defineConfig({
  plugins: [react(), tailwindcss()],

  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
    __GIT_BRANCH__: JSON.stringify(process.env.GITHUB_REF_NAME ?? "local"),
    __GIT_COMMIT__: JSON.stringify(process.env.GITHUB_SHA?.slice(0, 7) ?? "local"),
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },

      "^(?:/docs|/redoc|/openapi.json)": {
        target: "http://localhost:8000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
