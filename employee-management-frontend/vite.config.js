import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import os from "node:os";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Avoid EPERM issues on Windows/OneDrive when Vite clears `node_modules/.vite`
  // by placing the cache in the OS temp directory instead.
  cacheDir: path.join(os.tmpdir(), "employee-management-frontend-vite-cache"),
});
