// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import http from "node:http";

// Periodic background check to detect if local backend at port 5000 is active
let isLocalBackendAlive = false;

function checkLocal() {
  const req = http.request(
    { host: "127.0.0.1", port: 5000, path: "/health", timeout: 800, method: "GET" },
    (res) => {
      isLocalBackendAlive = res.statusCode === 200;
    }
  );
  req.on("error", () => {
    isLocalBackendAlive = false;
  });
  req.on("timeout", () => {
    req.destroy();
    isLocalBackendAlive = false;
  });
  req.end();
}

// Initial check & periodic 5s polling
checkLocal();
setInterval(checkLocal, 5000).unref();

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    server: {
      proxy: {
        "/api": {
          target: "https://nexlock-backend.onrender.com",
          changeOrigin: true,
          secure: false,
          router: () => {
            if (process.env.VITE_BACKEND_TARGET) {
              return process.env.VITE_BACKEND_TARGET;
            }
            return isLocalBackendAlive
              ? "http://127.0.0.1:5000"
              : "https://nexlock-backend.onrender.com";
          },
        },
      },
    },
  },
});
