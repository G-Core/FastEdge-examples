use proxy_wasm::traits::*;
use proxy_wasm::types::*;
use std::time::Duration;

// Entry point for the WebAssembly module
// Sets up logging and initializes the root context
proxy_wasm::main! {{
    proxy_wasm::set_log_level(LogLevel::Trace);
    proxy_wasm::set_root_context(|_| -> Box<dyn RootContext> { Box::new(HttpHeadersRoot) });
}}

// Enum representing the state of the HTTP call
#[derive(Debug, Clone, Copy, PartialEq)]
enum HttpCallState {
    // Initial state - HTTP call not yet made or response not received
    Initial,
    // HTTP call response received successfully
    ResponseReceived,
    // HTTP call failed (e.g., network error, timeout)
    CallFailed,
}

// Root context that creates HTTP contexts for each request
struct HttpHeadersRoot;

impl Context for HttpHeadersRoot {}

impl RootContext for HttpHeadersRoot {
    // Creates a new HTTP context for each incoming request
    // The state field starts at Initial to track whether we've received the HTTP call response
    fn create_http_context(&self, _context_id: u32) -> Option<Box<dyn HttpContext>> {
        Some(Box::new(HttpHeaders {
            state: HttpCallState::Initial,
        }))
    }

    fn get_type(&self) -> Option<ContextType> {
        Some(ContextType::HttpContext)
    }
}

// HTTP context that handles the request lifecycle
// state: Tracks the current state of the HTTP call using the HttpCallState enum
struct HttpHeaders {
    state: HttpCallState,
}

impl Context for HttpHeaders {
    // Callback invoked when an HTTP call response is received
    // This is triggered after dispatch_http_call completes
    //
    // Parameters:
    // - token_id: The unique identifier returned by dispatch_http_call
    // - num_headers: Number of response headers (0 if the call failed)
    // - body_size: Size of the response body in bytes
    // - _num_trailers: Number of trailing headers (unused in this example)
    fn on_http_call_response(
        &mut self,
        token_id: u32,
        num_headers: usize,
        body_size: usize,
        _num_trailers: usize,
    ) {
        println!(
            "Received http call response with token id: {token_id}, num_headers: {num_headers}"
        );

        // If num_headers is 0, the HTTP call failed (network error, timeout, etc.)
        if num_headers != 0 {
            // Example: Get a specific response header by name
            let user_agent = self.get_http_call_response_header("user-agent");
            println!("User-Agent: {:?}", user_agent);

            // Example: Get all response headers as Vec<(String, String)>
            let headers = self.get_http_call_response_headers();
            println!("Response headers:");
            for (name, value) in &headers {
                println!("  {}: {}", name, value);
            }

            // Example: Get all response headers as Vec<(String, Vec<u8>)> for binary data
            let headers_value = self.get_http_call_response_headers_bytes();
            for (name, value) in &headers_value {
                println!("  {}: {:?}", name, value);
            }

            // Example: Get the response body
            // Parameters: (offset, max_size)
            // offset=0 and max_size=body_size retrieves the entire body
            let body = self.get_http_call_response_body(0, body_size);
            if let Some(body) = body {
                println!("Response body: {}", String::from_utf8_lossy(&body));
            } else {
                println!("Body is empty or could not be retrieved.");
            }

            // Set state to ResponseReceived to indicate successful HTTP call response
            // This allows the request to continue when on_http_request_headers is called again
            self.state = HttpCallState::ResponseReceived;

            // Resume the paused HTTP request processing
            // The request will re-enter on_http_request_headers with state=ResponseReceived
            self.resume_http_request();
            // Alternative: self.resume_http_response() - use if you paused during response processing
        } else {
            // Set state to CallFailed to indicate the HTTP call failed
            self.state = HttpCallState::CallFailed;
            // HTTP call failed - abort the client request with an error
            self.reset_http_request();
        }
    }
}

impl HttpContext for HttpHeaders {
    // Called when request headers are received from the client
    // Returns Action::Continue to proceed, or Action::Pause to suspend processing
    fn on_http_request_headers(&mut self, _: usize, _: bool) -> Action {
        println!("state: {:?}", self.state);

        // Check if we've already processed the HTTP call response
        // state=ResponseReceived means the external HTTP call completed successfully
        if self.state == HttpCallState::ResponseReceived {
            println!("HTTP call response was received successfully, resuming request.");
            return Action::Continue;
        }

        // Check if the HTTP call failed
        if self.state == HttpCallState::CallFailed {
            println!("HTTP call failed, aborting request.");
            self.send_http_response(500, vec![], Some(b"HTTP call failed"));
            return Action::Pause;
        }

        // Make an asynchronous HTTP call to an external service
        // The request will be paused until the response is received
        //
        // dispatch_http_call parameters:
        // 1. upstream: The hostname/cluster to call (e.g., "httpbin.org")
        // 2. headers: Vec of (name, value) tuples for HTTP headers
        //    - :scheme: "http" or "https"
        //    - :authority: The Host header value
        //    - :path: The request path (must start with /)
        //    - :method: HTTP method (defaults to "GET" if not specified)
        //    - Any custom headers (e.g., "User-Agent", "Authorization")
        // 3. body: Optional request body as Option<&[u8]>
        // 4. trailers: Vec of trailing headers (usually empty)
        // 5. timeout: Duration before the call times out
        //
        // Returns: Result<u32, Status>
        // - Ok(token_id): Unique token to identify this call in on_http_call_response
        // - Err(status): Error status if the call couldn't be dispatched
        match self.dispatch_http_call(
            "httpbin.org",
            vec![
                // Required pseudo-headers for HTTP calls
                (":scheme", "https"), // Required for HTTP calls to specify the scheme
                (":authority", "httpbin.org"), // Required for HTTP calls to specify the authority (Host header)
                (":path", "/ip"), // Required for HTTP calls to specify the path (must start with /)
                // Standard HTTP headers
                ("User-Agent", "fastedge"),
            ],
            None, // No request body
            vec![],
            Duration::from_millis(1000),
        ) {
            Ok(token_id) => {
                println!("Dispatched http call with token id: {token_id}");
                // Pause the request processing until on_http_call_response is called
                // The request will resume when we call self.resume_http_request()
                Action::Pause
            }
            Err(status) => {
                // Failed to dispatch the HTTP call - send error response to client
                self.send_http_response(
                    to_status_code(status),
                    vec![],
                    Some(format!("Failed to dispatch http call: {:?}", status).as_bytes()),
                );
                Action::Pause
            }
        }
    }
}

// Helper function to convert proxy-wasm Status codes to HTTP status codes
fn to_status_code(status: Status) -> u32 {
    match status {
        Status::Ok => 200,
        Status::NotFound => 404,
        Status::BadArgument => 400,
        Status::SerializationFailure => 500,
        Status::ParseFailure => 400,
        Status::Empty => 204,
        Status::CasMismatch => 409,
        Status::InternalFailure => 500,
        _ => 500,
    }
}
