import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const input = process.argv[2];
const output = process.argv[3];

if (!input) {
  console.error("Error: No name specified");
  process.exit(1);
}

const inputIsPath = input.includes("/");

if (inputIsPath && !output) {
  console.error("Error: Input path provided without output path");
  process.exit(1);
}

const inputPath = inputIsPath ? input : `./src/${input}/index.js`;
const outputPath = inputIsPath ? output : `./dist/${input}.wasm`;

if (!inputIsPath) {
  //Check if project contains fastedge build-config.
  const buildConfigPath = `./src/${input}/.fastedge/build-config.js`;
  if (existsSync(buildConfigPath)) {
    // Run fastedge-build with the build-config file.
    const cwd = `${process.cwd()}/src/${input}`;
    spawnSync("fastedge-build", ["-c"], {
      stdio: "inherit",
      cwd,
    });
    process.exit(0);
  }
}

// No Fastedge build config. Build normally.
spawnSync("fastedge-build", [inputPath, outputPath], {
  stdio: "inherit",
});
