import { spawnSync } from "node:child_process";

const wasmName = process.argv[2];

if (!wasmName) {
  console.error("Error: No wasm file specified");
  process.exit(1);
}

const wasmFile = `./dist/${wasmName}.wasm`;

const port = process.argv[3] ?? "3006";

const envs = {};

const injectEnvVariables = (envs = {}) => {
  const result = [];
  for (const key in envs) {
    result.push("--env", `${key}=${envs[key]}`);
  }
  return result;
};

const cliArgs = [
  "http",
  "-p",
  port,
  "-w",
  wasmFile,
  "--wasi-http",
  "true",
  ...injectEnvVariables(envs),
];

spawnSync("fastedge-cli", cliArgs, {
  stdio: "inherit",
  env: {
    ...process.env, // Preserve existing environment variables
    RUST_LOG: "info,http_service=trace",
  },
});
