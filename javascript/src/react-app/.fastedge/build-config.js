const config = {
  type: "static",
  input: ".fastedge/static-index.js",
  ignoreDotFiles: true,
  ignoreDirs: ["./node_modules"],
  ignoreWellKnown: false,
  output: "../../dist/react-app.wasm",
  publicDir: "./build",
};

const serverConfig = {
  type: "static",
  extendedCache: [],
  publicDirPrefix: "",
  compression: [],
  notFoundPage: "/404.html",
  autoExt: [],
  autoIndex: ["index.html", "index.htm"],
  spaEntrypoint: "/index.html",
};

export { config, serverConfig };
