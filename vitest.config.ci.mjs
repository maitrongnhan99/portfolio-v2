/// <reference types="vitest/config" />
import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./vitest.config.mjs";

// CI-specific config with reasonable coverage thresholds
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        thresholds: {
          // Start with lower but meaningful thresholds for CI
          branches: 50,
          functions: 50,
          lines: 60,
          statements: 60,
        },
        // Exclude test files and configuration from coverage
        exclude: [
          "**/*.test.{ts,tsx}",
          "**/*.spec.{ts,tsx}",
          "**/tests/**",
          "**/*.config.*",
          "**/node_modules/**",
          "**/.next/**",
          "**/coverage/**",
          "**/dist/**",
          "**/*.d.ts",
          "**/mockServiceWorker.js",
        ],
      },
    },
  })
);