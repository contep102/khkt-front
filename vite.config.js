import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { Buffer } from "buffer";
import process from "process";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
    global: "window", // Đặt biến `global` thành `window`
  },
  resolve: {
    alias: {
      buffer: "buffer",
      process: "process/browser",
      events: "events",
      util: "util",
    },
  },
  build: {
    rollupOptions: {
      external: ["events", "util", "process"], // Đảm bảo các module này không bị lỗi
    },
  },
  optimizeDeps: {
    include: ["buffer", "process"],
  },
});
