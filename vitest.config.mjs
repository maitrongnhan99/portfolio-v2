/// <reference types="vitest/config" />
import { resolve } from "path";
import { defineConfig } from "vite";
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Simplified config without React plugin for better ESM compatibility
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "services/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
        "models/**/*.{ts,tsx}",
        "app/api/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.d.ts",
        "**/node_modules/**",
        "**/*.config.*",
        "**/mockServiceWorker.js",
      ],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    testTimeout: 20000, // 20 seconds for longer-running tests
    pool: "forks", // Better compatibility with Next.js
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Add teardown timeout for MongoDB
    teardownTimeout: 10000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
});