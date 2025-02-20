⏮️ Back to main [README.md](../README.md)

# Rust

## Examples

- cdn - CDN apps that use [Proxy-Wasm](https://github.com/proxy-wasm/spec) spec
  - geoblock - block user if user IP is from blacklisted country
  - jwt - basic JWT validation (signature and expiration)
- http - HTTP applications that use [FastEdge Rust SDK](https://github.com/G-Core/FastEdge-sdk-rust)
  - print - print all request headers
  - s3upload - upload file to S3 storage
  - markdown - render markdown to HTML
  - smart-switch - toggle smart outlet status by calling SmartThings API

## Build

### Toolchain setup

Add Wasm target by running `rustup target add wasm32-wasi`

### Compile example

Change to example directory and run `cargo build --release`, resulting `wasm` file will be placed into `rust/target/wasm32-wasi/release` directory.
