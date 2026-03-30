import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    css: { modules: { classNameStrategy: "non-scoped" } },
    setupFiles: ["./src/test-setup.ts"],
  },
});
