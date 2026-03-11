Back to main [README.md](../README.md)

# AssemblyScript Examples

These examples have moved to the [`proxy-wasm-sdk-as`](https://github.com/G-Core/proxy-wasm-sdk-as) repository, where they live alongside the SDK they depend on.

- [Body manipulation](https://github.com/G-Core/proxy-wasm-sdk-as/tree/master/examples/body)
- [Geo Block](https://github.com/G-Core/proxy-wasm-sdk-as/tree/master/examples/geoBlock)
- [Geo Redirect](https://github.com/G-Core/proxy-wasm-sdk-as/tree/master/examples/geoRedirect)
- [Headers](https://github.com/G-Core/proxy-wasm-sdk-as/tree/master/examples/headers)
- [JWT](https://github.com/G-Core/proxy-wasm-sdk-as/tree/master/examples/jwt)
- [KV Store](https://github.com/G-Core/proxy-wasm-sdk-as/tree/master/examples/kvStore)
- [Log time](https://github.com/G-Core/proxy-wasm-sdk-as/tree/master/examples/logTime)
- [Properties](https://github.com/G-Core/proxy-wasm-sdk-as/tree/master/examples/properties)

## Build

Each example is standalone. Clone the SDK repo and build the example you want:

```sh
git clone git@github.com:G-Core/proxy-wasm-sdk-as.git
cd proxy-wasm-sdk-as/examples/<name>
pnpm install
pnpm run asbuild
```

This produces `build/<name>.wasm` (release) and `build/<name>-debug.wasm` (debug with source maps).

## Running an example

Upload `build/<name>.wasm` to the [FastEdge portal](https://portal.gcore.com) and attach it to your CDN application.

See the individual example README for any required environment variables or secret variables.
