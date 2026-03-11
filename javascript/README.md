Back to main [README.md](../README.md)

# JavaScript Examples

These examples have moved to the [`FastEdge-sdk-js`](https://github.com/G-Core/FastEdge-sdk-js) repository, where they live alongside the SDK they depend on.

- [AB Testing](https://github.com/G-Core/FastEdge-sdk-js/tree/main/examples/ab-testing)
- [Geo Redirect](https://github.com/G-Core/FastEdge-sdk-js/tree/main/examples/geo-redirect)
- [KV Store](https://github.com/G-Core/FastEdge-sdk-js/tree/main/examples/kv-store)
- [MCP Server](https://github.com/G-Core/FastEdge-sdk-js/tree/main/examples/mcp-server)
- [Static Assets](https://github.com/G-Core/FastEdge-sdk-js/tree/main/examples/static-assets)
- [Template Invoice](https://github.com/G-Core/FastEdge-sdk-js/tree/main/examples/template-invoice)
- [Template Invoice (AB Testing)](https://github.com/G-Core/FastEdge-sdk-js/tree/main/examples/template-invoice-ab-testing)

## Build

Each example is standalone. Clone the SDK repo and build the example you want:

```sh
git clone git@github.com:G-Core/FastEdge-sdk-js.git
cd FastEdge-sdk-js/examples/<name>
npm install
npm run build
```

This produces `dist/<name>.wasm`.

## Running an example

Upload `dist/<name>.wasm` to the [FastEdge portal](https://portal.gcore.com) and attach it to your HTTP application.

See the individual example README for any required environment variables or configuration.
