import { build, context } from "esbuild";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const isWatching = process.argv.includes("--watch");

const outfile = "./.fastedge/static-index.js";

const reWriteAliasImports = (relativeFilePath) => {
  const filePath = fileURLToPath(
    new URL(path.resolve(process.cwd(), relativeFilePath), import.meta.url)
  );
  const content = readFileSync(filePath, "utf8");
  const updatedContent = content.replaceAll(/from "@fastedge\//g, 'from "./');
  if (content !== updatedContent) {
    writeFileSync(filePath, updatedContent);
  }
};

let aliasPlugin = {
  name: "replace-external-alias",
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length > 0) {
        return;
      }
      reWriteAliasImports(outfile);
    });
  },
};

const buildConfig = {
  entryPoints: ["./fastedge-server/index.ts"],
  bundle: true,
  outfile,
  format: "esm",
  plugins: [aliasPlugin],
  external: ["fastedge::env", "@gcoredev/fastedge-sdk-js", "@fastedge/*"],
  logLevel: "info",
};

try {
  if (isWatching) {
    const ctx = await context(buildConfig);
    await ctx.watch();
  } else {
    await build(buildConfig);
  }
} catch (e) {
  console.error("Build Failed:", e);
}
