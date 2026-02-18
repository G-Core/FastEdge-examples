# HTTP Call Example

This example demonstrates how to make asynchronous HTTP calls from a WebAssembly edge function using the `dispatch_http_call` API in the proxy-wasm framework.

## Overview

This edge function intercepts incoming HTTP requests and makes an external HTTP call to `httpbin.org/ip` before processing the client request. It showcases:

- **Asynchronous HTTP calls** using `dispatch_http_call`
- **Request pausing and resuming** to wait for external API responses
- **State management** using type-safe enums
- **Response handling** including headers and body parsing
- **Error handling** for failed HTTP calls

## How It Works

### Request Flow

```
┌─────────────┐
│   Client    │
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ on_http_request_headers             │
│ (State: Initial)                    │
│                                     │
│ • Dispatch HTTP call to httpbin.org │
│ • Return Action::Pause              │
└──────┬──────────────────────────────┘
       │
       │ [Request is paused]
       │
       ▼
┌─────────────────────────────────────┐
│ External HTTP Call                  │
│ GET https://httpbin.org/ip          │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ on_http_call_response               │
│                                     │
│ • Receive response                  │
│ • Parse headers & body              │
│ • Set state to ResponseReceived     │
│ • Call resume_http_request()        │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ on_http_request_headers             │
│ (State: ResponseReceived)           │
│                                     │
│ • Check state                       │
│ • Return Action::Continue           │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────┐
│  Continue   │
│  Request    │
└─────────────┘
```

### State Management

The example uses a type-safe enum to track the HTTP call state:

```rust
enum HttpCallState {
    Initial,           // No HTTP call made yet
    ResponseReceived,  // HTTP call succeeded
    CallFailed,        // HTTP call failed
}
```

This provides better type safety and clarity compared to using magic numbers.

## Key Components

### 1. `dispatch_http_call`

The core function for making HTTP calls:

```rust
self.dispatch_http_call(
    "httpbin.org",                    // Upstream host
    vec![
        (":scheme", "https"),         // Protocol
        (":authority", "httpbin.org"), // Host header
        (":path", "/ip"),             // Request path
        ("User-Agent", "fastedge"),   // Custom headers
    ],
    Some("body".as_bytes()),          // Request body (optional)
    vec![],                           // Trailers (usually empty)
    Duration::from_millis(1000),      // Timeout
)
```

**Returns:** `Result<u32, Status>`
- `Ok(token_id)`: Unique identifier for this HTTP call
- `Err(status)`: Error if the call couldn't be dispatched

### 2. `on_http_call_response`

Callback invoked when the HTTP call completes:

```rust
fn on_http_call_response(
    &mut self,
    token_id: u32,      // Matches the token from dispatch_http_call
    num_headers: usize, // 0 if the call failed
    body_size: usize,   // Size of response body in bytes
    _num_trailers: usize,
)
```

**Important:** If `num_headers == 0`, the HTTP call failed (timeout, network error, etc.)

### 3. Response Data Access

The example demonstrates how to retrieve response data:

```rust
// Get a specific header
let user_agent = self.get_http_call_response_header("user-agent");

// Get all headers as Vec<(String, String)>
let headers = self.get_http_call_response_headers();

// Get all headers as Vec<(String, Vec<u8>)> for binary data
let headers_bytes = self.get_http_call_response_headers_bytes();

// Get the response body
let body = self.get_http_call_response_body(0, body_size);
```

### 4. Request Pause/Resume

```rust
// Pause the request while waiting for HTTP call
Action::Pause

// Resume the request after HTTP call completes
self.resume_http_request();

// Or resume response processing (if paused during response phase)
self.resume_http_response();
```

## Building

### Prerequisites

- Rust toolchain with `wasm32-wasip1` target
- Cargo

### Install WASM target

```bash
rustup target add wasm32-wasip1
```

### Build the WASM module

```bash
cargo build --target wasm32-wasip1 --release
```

The compiled WASM file will be located at:
```
target/wasm32-wasip1/release/http_call.wasm
```

## Configuration

### Upstream Configuration

Before deploying, ensure your edge platform is configured to allow HTTP calls to the upstream host (`httpbin.org` in this example). The exact configuration depends on your edge platform.

### Timeout Configuration

The example uses a 1-second timeout:

```rust
Duration::from_millis(1000)
```

Adjust this based on your use case and the expected response time of the external service.

## Error Handling

The example handles errors at multiple levels:

1. **Dispatch Failure**: If `dispatch_http_call` returns an error
   ```rust
   Err(status) => {
       self.send_http_response(
           to_status_code(status),
           vec![],
           Some(format!("Failed to dispatch http call: {:?}", status).as_bytes()),
       );
       Action::Pause
   }
   ```

2. **HTTP Call Failure**: If the call times out or encounters network errors
   ```rust
   if num_headers == 0 {
       self.state = HttpCallState::CallFailed;
       self.reset_http_request();
   }
   ```

3. **State Check**: Verify state before continuing
   ```rust
   if self.state == HttpCallState::CallFailed {
       self.send_http_response(500, vec![], Some(b"HTTP call failed"));
       return Action::Pause;
   }
   ```

## Use Cases

This pattern is useful for:

- **Authentication/Authorization**: Validate tokens with an auth service
- **Rate Limiting**: Check rate limits with a central service
- **Data Enrichment**: Fetch additional data to enhance the request/response
- **A/B Testing**: Query a configuration service for feature flags
- **Geo-blocking**: Check IP addresses against a blocklist API
- **Fraud Detection**: Validate requests against a fraud detection service

## Best Practices

1. **Set appropriate timeouts**: Balance between waiting for responses and user experience
2. **Handle failures gracefully**: Always check `num_headers` and handle errors
3. **Use state management**: Track the request lifecycle with enums, not magic numbers
4. **Log appropriately**: Use `println!` for debugging (available in the logs)
5. **Minimize HTTP calls**: Each call adds latency; cache when possible
6. **Consider fallbacks**: Have a default behavior if the HTTP call fails

## Debugging

The example includes extensive logging:

```rust
println!("state: {:?}", self.state);
println!("Dispatched http call with token id: {token_id}");
println!("Received http call response with token id: {token_id}");
println!("Response body: {}", String::from_utf8_lossy(&body));
```

Enable trace-level logging to see all output:

```rust
proxy_wasm::set_log_level(LogLevel::Trace);
```

## Advanced Topics

### Multiple HTTP Calls

You can make multiple HTTP calls per request. Store the returned `token_id` from each `dispatch_http_call` and compare against those values in `on_http_call_response`:

```rust
// In your context:
struct HttpContext {
    call1_token: Option<u32>,
    call2_token: Option<u32>,
    // ...
}

// When dispatching calls:
if let Ok(token_id) = proxy_wasm::hostcalls::dispatch_http_call(/* ... */) {
    self.call1_token = Some(token_id);
}

if let Ok(token_id) = proxy_wasm::hostcalls::dispatch_http_call(/* ... */) {
    self.call2_token = Some(token_id);
}

// In on_http_call_response:
match Some(token_id) {
    t if t == self.call1_token => {
        // Handle first call
    }
    t if t == self.call2_token => {
        // Handle second call
    }
    _ => {
        // Unknown token
    }
}
```

### HTTP Methods

Specify the HTTP method using the `:method` pseudo-header:

```rust
vec![
    (":method", "POST"),
    (":scheme", "https"),
    (":authority", "api.example.com"),
    (":path", "/data"),
    ("Content-Type", "application/json"),
]
```

### Custom Headers

Add any custom headers to the request:

```rust
vec![
    // ...required headers...
    ("Authorization", "Bearer token123"),
    ("X-Custom-Header", "value"),
]
```

## Troubleshooting

### HTTP call always fails (num_headers == 0)

- Check upstream configuration on your edge platform
- Verify the timeout is sufficient
- Ensure the upstream host is reachable from the edge
- Check for DNS resolution issues

### Request hangs indefinitely

- Ensure you call `resume_http_request()` or `resume_http_response()`
- Verify state management is correct
- Check that you return `Action::Continue` after the HTTP call completes

### Response body is empty

- Verify the upstream actually returns a body
- Check that `body_size > 0` before calling `get_http_call_response_body`
- Ensure you're reading the correct offset and size

## License

See the main repository LICENSE file.

## Related Examples

- [JWT Validation](../jwt/) - Validates JWT tokens (another use case for HTTP calls)
- [Geo Block](../geoblock/) - Blocks requests based on geographic location
- [KV Store](../../http/kv-store/) - Demonstrates persistent storage

## References

- [proxy-wasm Rust SDK](https://github.com/proxy-wasm/proxy-wasm-rust-sdk)
- [WebAssembly System Interface (WASI)](https://wasi.dev/)
- [httpbin.org API documentation](https://httpbin.org/)

