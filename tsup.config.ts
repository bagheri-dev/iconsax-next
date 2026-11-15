import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/types.ts", "src/icons/*.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  bundle: false,
  clean: true,
  sourcemap: false,
});