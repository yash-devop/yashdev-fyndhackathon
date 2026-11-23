import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/scripts/seed.ts"],
  format: ["esm"],
  outDir: "dist/seed",
  clean: true,
  noExternal: ["@repo/env"],
});
