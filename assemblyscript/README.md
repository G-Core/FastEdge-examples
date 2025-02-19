⏮️ Back to main [README.md](../README.md)

# AssemblyScript Examples

- [JWT](./assembly/jwt/README.md)
- [Geo Block](./assembly/geoBlock/README.md)

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
npm run build:geo
```

**Note:**
See [package.json](./package.json) for other build scripts.

This will take the /geoBlock example and build the wasm into the `./build/geoBlock` folder named as such: `geoBlock.wasm`

### Running an example

Having built the binary of any of these examples you can safely load them within the Client Portal and test as you please.

### Proxy-Wasm API

At present not all proxy-wasm functionality is complete. This is still under construction.

For now we only have `onRequestHeaders()`

logging: See JWT example for directly accessing `process.stdout`
