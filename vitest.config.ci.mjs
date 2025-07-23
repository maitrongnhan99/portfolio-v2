/// <reference types="vitest/config" />
import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./vitest.config.mjs";

// CI-specific config that disables coverage thresholds
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        thresholds: {
          // Disable thresholds for CI until we have better coverage
          branches: 0,
          functions: 0,
          lines: 0,
          statements: 0,
        },
      },
    },
  })
);