export * from "@gcoredev/proxy-wasm-sdk-as/assembly/proxy"; // this exports the required functions for the proxy to interact with us.
import {
  Context,
  FilterHeadersStatusValues,
  Headers,
  log,
  LogLevelValues,
  registerRootContext,
  RootContext,
  send_http_response,
  setLogLevel,
  stream_context,
} from "@gcoredev/proxy-wasm-sdk-as/assembly";

function collectHeaders(
  headers: Headers,
  logHeaders: bool = true
): Set<string> {
  // Iterate over headers adding them to the returned set and log them if required
  const set = new Set<string>();
  for (let i = 0; i < headers.length; i++) {
    const name = String.UTF8.decode(headers[i].key);
    const value = String.UTF8.decode(headers[i].value);
    if (logHeaders) log(LogLevelValues.info, `#header -> ${name}: ${value}`);
    set.add(`${name}:${value}`);
  }
  return set;
}

function validateHeaders(
  headers: Headers,
  expectedHeaders: Set<string>
): Set<string> {
  // Ensure the headers only contain the expected headers
  const headersArr = collectHeaders(headers, false).values();
  const diff = new Set<string>();

  for (let i = 0; i < headersArr.length; i++) {
    const header = headersArr[i];
    if (header.startsWith("new-header-")) {
      const headerExists = expectedHeaders.has(header);
      if (!headerExists) diff.add(header);
    }
  }
  return diff;
}

class HttpHeadersRoot extends RootContext {
  createContext(context_id: u32): Context {
    setLogLevel(LogLevelValues.info); // Set the log level to info - for more logging reduce this to LogLevelValues.debug
    return new HttpHeaders(context_id, this);
  }
}

class HttpHeaders extends Context {
  constructor(context_id: u32, root_context: HttpHeadersRoot) {
    super(context_id, root_context);
  }

  onRequestHeaders(a: u32, end_of_stream: bool): FilterHeadersStatusValues {
    log(LogLevelValues.debug, "onRequestHeaders >> ");

    // Get the request headers
    const originalHeaders = collectHeaders(
      stream_context.headers.request.get_headers()
    );

    if (originalHeaders.size === 0) {
      send_http_response(
        550,
        "internal server error",
        String.UTF8.encode("Internal server error"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }

    // Check if the "host" header is present
    const hostHeader = stream_context.headers.request.get("host");
    if (hostHeader === null) {
      send_http_response(
        551,
        "internal server error",
        String.UTF8.encode("Internal server error"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }

    // Add new headers
    stream_context.headers.request.add("new-header-01", "value-01");
    stream_context.headers.request.add("new-header-02", "value-02");
    stream_context.headers.request.add("new-header-03", "value-03");

    // Remove a header
    // Known issue: - nginx will not remove the header it will set it to an empty value.
    stream_context.headers.request.remove("new-header-01");

    // Modify a header
    stream_context.headers.request.replace("new-header-02", "new-value-02");

    // Add a new header with the same name
    stream_context.headers.request.add("new-header-03", "value-03-a");

    // Try to set/add response headers
    stream_context.headers.response.add("new-response-header", "value-01");

    // Ensure the "cache-control" header is present - cannot replace a header that does not exist
    const cacheControlHeader =
      stream_context.headers.response.get("cache-control");
    if (cacheControlHeader.length > 0) {
      stream_context.headers.response.replace("cache-control", "");
    }

    // Ensure the "new-response-header" header is present.
    // This is a common issue in Proxy-Wasm environments, where certain operations are only valid during specific phases of the request/response lifecycle.
    // i.e. runtime will panic as response headers are not available in the request phase.
    const newResponseHeader = stream_context.headers.response.get(
      "new-response-header"
    );
    if (newResponseHeader.length > 0) {
      stream_context.headers.response.replace(
        "new-response-header",
        "value-02"
      );
    }

    // Initialize expectedHeaders
    const expectedHeaders = new Set<string>();
    expectedHeaders.add("new-header-02:new-value-02");
    expectedHeaders.add("new-header-03:value-03");
    expectedHeaders.add("new-header-03:value-03-a");

    // Validate headers
    const diff = validateHeaders(
      stream_context.headers.request.get_headers(),
      expectedHeaders
    );

    if (diff.size > 0) {
      log(
        LogLevelValues.warn,
        `Unexpected request headers: ` + diff.values().join(", ")
      );
      send_http_response(
        552,
        "internal server error",
        String.UTF8.encode("Internal server error"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }

    log(LogLevelValues.debug, `onRequestHeaders: OK!`);
    return FilterHeadersStatusValues.Continue;
  }

  onResponseHeaders(a: u32, end_of_stream: bool): FilterHeadersStatusValues {
    log(LogLevelValues.debug, "onResponseHeaders >> ");

    const originalHeaders = collectHeaders(
      stream_context.headers.response.get_headers()
    );

    if (originalHeaders.size === 0) {
      send_http_response(
        550,
        "internal server error",
        String.UTF8.encode("Internal server error"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }

    // Check if the "host" header is present
    const hostHeader = stream_context.headers.response.get("host");
    if (hostHeader === null) {
      send_http_response(
        551,
        "internal server error",
        String.UTF8.encode("Internal server error"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }

    // Add new headers
    stream_context.headers.response.add("new-header-01", "value-01");
    stream_context.headers.response.add("new-header-02", "value-02");
    stream_context.headers.response.add("new-header-03", "value-03");

    // Remove a header
    stream_context.headers.response.remove("new-header-01");

    // Modify a header
    stream_context.headers.response.replace("new-header-02", "new-value-02");

    // Add a new header with the same name
    stream_context.headers.response.add("new-header-03", "value-03-a");

    // Initialize expectedHeaders before using it
    const expectedHeaders = new Set<string>();
    expectedHeaders.add("new-header-02:new-value-02");
    expectedHeaders.add("new-header-03:value-03");
    expectedHeaders.add("new-header-03:value-03-a");

    const diff = validateHeaders(
      stream_context.headers.response.get_headers(),
      expectedHeaders
    );

    if (diff.size > 0) {
      log(
        LogLevelValues.warn,
        `Unexpected response headers: ` + diff.values().join(", ")
      );
      send_http_response(
        552,
        "internal server error",
        String.UTF8.encode("Internal server error"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }

    log(LogLevelValues.debug, `onResponseHeaders: OK!`);

    return FilterHeadersStatusValues.Continue;
  }

  onLog(): void {
    log(
      LogLevelValues.info,
      "onLog >> completed (contextId): " + this.context_id.toString()
    );
  }
}

registerRootContext((context_id: u32) => {
  return new HttpHeadersRoot(context_id);
}, "httpheaders");
