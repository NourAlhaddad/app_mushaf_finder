import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const selectorScopePlugin = {
  postcssPlugin: "mushaf-finder-selector-scope",
  // Keep the frontend styles from leaking into the host WordPress theme.
  Rule(rule: { selectors: string[] }) {
    rule.selectors = rule.selectors.map((selector) => {
      const trimmed = selector.trim();
      if (trimmed.startsWith(".mushaf-finder-root")) return trimmed;
      if (trimmed === ":root" || trimmed === "body") {
        return ".mushaf-finder-root";
      }
      if (trimmed === "*") {
        return ".mushaf-finder-root, .mushaf-finder-root *";
      }
      return `.mushaf-finder-root ${trimmed}`;
    });
  },
};

export default defineConfig({
  base: "./",
  plugins: [react()],
  css: {
    postcss: {
      plugins: [selectorScopePlugin],
    },
  },
  build: {
    manifest: true,
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
