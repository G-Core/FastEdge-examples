⏮️ Back to main [README.md](../README.md)

# Javascript Examples

- Geo Redirect

## Build

### Initial Setup

Having pulled down the repo: `git clone git@github.com:G-Core/FastEdge-examples.git`

First enter the `javascript` directory, followed by installing all the `node_modules`.

```sh
cd FastEdge-examples/javascript &&
npm install
```

### Building an example

Having everything installed you can use the simple `npm run build` command to build individual examples.

This script takes an input parameter which is the name of the examples folder. e.g.: "geo-redirect"

```sh
npm run build geo-redirect
```

This will take the /geo-redirect example and build the wasm into the `./dist` folder named as such: `geo-redirect.wasm`

All the examples in this repo can also be built using `npx fastedge-build` as per the instructions in the [FastEdge-sdk-js](https://g-core.github.io/FastEdge-sdk-js/)

The build script in this repo is purely a helper function to simplify this build process.

**Note:**
Some of these example folders are complex and have there own build pipelines (e.g. react-app). Follow their README.md before building.

### Running an example

Having built the binary of any of these examples you can safely load them within the Client Portal and test as you please.

Alternatively you can run these examples locally using the [FastEdge-cli](https://github.com/G-Core/FastEdge-lib)
