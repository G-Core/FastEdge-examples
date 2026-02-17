⏮️ Back to main [README.md](../README.md)

# AssemblyScript Examples

- [Body manipulation](./assembly/body/README.md)
- [Geo Block](./assembly/geoBlock/README.md)
- [Headers](./assembly/headers/README.md)
- [JWT](./assembly/jwt/README.md)
- [KV Store](./assembly/kvStore/README.md)
- [Log time](./assembly/logTime/README.md)
- [Properties](./assembly/properties/README.md)

## Build

### Initial Setup

Having pulled down the repo: `git clone git@github.com:G-Core/FastEdge-examples.git`

First enter the `assemblyscript` directory, followed by installing all the `node_modules`.

```sh
cd FastEdge-examples/assemblyscript &&
npm install
```

### Building an example

e.g.

```sh
npm run build:geoBlock
```

**Note:**
See [package.json](./package.json) for other build scripts.

This will take the /geoBlock example and build the wasm into the `./build/geoBlock` folder named as such: `geoBlock.wasm`

### Running an example

Having built the binary of any of these examples you can safely load them within the Client Portal and test as you please.

Alternatively read [here](https://github.com/G-Core/proxy-wasm-sdk-as/blob/master/ENVOY.md) about using envoy locally. **Please Note: Envoy is NOT a direct replacement!!**

### Proxy-Wasm API

At present not all proxy-wasm functionality is complete. This is still under construction.

Our `@gcoredev/proxy-wasm-sdk-as` does provide some helper functions:

#### Logging

As we do not yet have a complete `proxy_log` implementation, we are temporarily providing this functionality via a wasi-shim to std-out.

This means instead of importing the default Log function from `@gcoredev/proxy-wasm-sdk-as/assembly` please use the FastEdge version from `@gcoredev/proxy-wasm-sdk-as/assembly/fastedge`

It uses the same signature, so in the future only the import will need updating. See the JWT Example for usage.

By default only `LogLevelValues.info` messages and above will be logged. If you need Debug and/or Trace logging you can set the log level using:

`setLogLevel(LogLevelValues.debug)`

#### Environment Variables

Getting environment variables is as easy as importing the `getEnvVar()` from `@gcoredev/proxy-wasm-sdk-as/assembly/fastedge`

See the GeoBlock example for usage. If it does not find a matching envVar it returns an empty string.

#### Secret Variables

Getting secrets is as easy as importing the `getSecretVar()` from `@gcoredev/proxy-wasm-sdk-as/assembly/fastedge`

See the JWT example for usage. If it does not find a matching secret it returns an empty string.

[secrets and slots explained](https://g-core.github.io/FastEdge-sdk-js/reference/fastedgesecret/getsecreteffectiveat/#slots-and-secret-rollover)
