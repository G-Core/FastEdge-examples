Back to main [README.md](../README.md)

# Rust Examples

These examples have moved to the [`FastEdge-sdk-rust`](https://github.com/G-Core/FastEdge-sdk-rust) repository, where they live alongside the SDK they depend on.

### CDN (proxy-wasm)

- [Body](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/body)
- [Convert Image](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/convert_image)
- [Custom](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/custom)
- [Custom Error Pages](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/custom_error_pages)
- [Geo Block](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/geoblock)
- [Geo Redirect](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/geo_redirect)
- [Headers](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/headers)
- [HTTP Call](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/http_call)
- [JWT](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/jwt)
- [Key Value](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/key_value)
- [Large Env Variable](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/large_env_variable)
- [Log Time](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/log_time)
- [Markdown to HTML](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/md2html)
- [Properties](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/properties)
- [Variables and Secrets](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/cdn/variables_and_secrets)

### HTTP Basic (sync)

- [API Wrapper](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/basic/api_wrapper)
- [Backend](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/basic/backend)
- [Hello World](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/basic/hello_world)
- [Markdown Render](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/basic/markdown_render)
- [Outbound Fetch](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/basic/outbound_fetch)
- [Print](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/basic/print)
- [S3 Upload](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/basic/s3upload)
- [Secret](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/basic/secret)
- [Smart Switch](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/basic/smart_switch)
- [Watermark](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/basic/watermark)

### HTTP WASI (async)

- [Geo Redirect](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/wasi/geo_redirect)
- [Headers](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/wasi/headers)
- [Hello World](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/wasi/hello_world)
- [Key Value](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/wasi/key_value)
- [Large Env Variable](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/wasi/large_env_variable)
- [Outbound Fetch](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/wasi/outbound_fetch)
- [Secret Rollover](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/wasi/secret_rollover)
- [Simple Fetch](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/wasi/simple_fetch)
- [Variables and Secrets](https://github.com/G-Core/FastEdge-sdk-rust/tree/main/examples/http/wasi/variables_and_secrets)

## Build

Each example is standalone. Clone the SDK repo and build the example you want:

```sh
git clone git@github.com:G-Core/FastEdge-sdk-rust.git
cd FastEdge-sdk-rust/examples/<category>/<name>
cargo build --release
```

## Running an example

Upload the resulting `.wasm` file to the [FastEdge portal](https://portal.gcore.com) and attach it to your CDN or HTTP application.

See the individual example README for any required environment variables or configuration.
