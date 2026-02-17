export * from "@gcoredev/proxy-wasm-sdk-as/assembly/proxy"; // this exports the required functions for the proxy to interact with us.
import {
  BufferTypeValues,
  Context,
  FilterDataStatusValues,
  FilterHeadersStatusValues,
  get_buffer_bytes,
  get_property,
  log,
  LogLevelValues,
  registerRootContext,
  RootContext,
  set_buffer_bytes,
  set_property,
  stream_context,
} from "@gcoredev/proxy-wasm-sdk-as/assembly";
import { setLogLevel } from "@gcoredev/proxy-wasm-sdk-as/assembly/fastedge";

class HttpBodyRoot extends RootContext {
  createContext(context_id: u32): Context {
    setLogLevel(LogLevelValues.info); // Set the log level to info - for more logging reduce this to LogLevelValues.debug
    return new HttpBody(context_id, this);
  }
}

class HttpBody extends Context {
  constructor(context_id: u32, root_context: HttpBodyRoot) {
    super(context_id, root_context);
  }

  onRequestHeaders(
    headers: u32,
    end_of_stream: bool
  ): FilterHeadersStatusValues {
    log(LogLevelValues.debug, "onRequestHeaders >>");
    // Remove the "content-length" header
    stream_context.headers.request.remove("content-length");
    return FilterHeadersStatusValues.Continue;
  }

  onRequestBody(
    body_buffer_length: usize,
    end_of_stream: bool
  ): FilterDataStatusValues {
    log(LogLevelValues.debug, "onRequestBody >>");
    if (!end_of_stream) {
      // Wait until the complete body is buffered
      return FilterDataStatusValues.StopIterationAndBuffer;
    }

    // Retrieve the body from the HttpRequestBody buffer
    const bodyBytes = get_buffer_bytes(
      BufferTypeValues.HttpRequestBody,
      0,
      <u32>body_buffer_length
    );

    if (bodyBytes.byteLength > 0) {
      const bodyStr = String.UTF8.decode(bodyBytes);
      log(LogLevelValues.debug, "onRequestBody >> bodyStr: " + bodyStr);
      if (bodyStr.includes("Client")) {
        const newBody = `Original message body (${body_buffer_length.toString()} bytes) redacted.\n`;
        set_buffer_bytes(
          BufferTypeValues.HttpRequestBody,
          0,
          <u32>body_buffer_length,
          String.UTF8.encode(newBody)
        );
      }
    }
    return FilterDataStatusValues.Continue;
  }

  onResponseHeaders(a: u32, end_of_stream: bool): FilterHeadersStatusValues {
    log(LogLevelValues.debug, "onResponseHeaders >>");

    // Remove "content-length" header as the body size will change
    stream_context.headers.response.remove("content-length");

    // Set "transfer-encoding" to "chunked"
    stream_context.headers.response.replace("transfer-encoding", "Chunked");

    const contentType = stream_context.headers.response.get("content-type");
    if (contentType.length > 0) {
      set_property("response.content_type", String.UTF8.encode(contentType));
    }

    return FilterHeadersStatusValues.Continue;
  }

  onResponseBody(
    body_buffer_length: usize,
    end_of_stream: bool
  ): FilterDataStatusValues {
    log(LogLevelValues.debug, "onResponseBody >>" + end_of_stream.toString());

    if (!end_of_stream) {
      // Wait until the complete body is buffered
      return FilterDataStatusValues.StopIterationAndBuffer;
    }

    log(
      LogLevelValues.debug,
      "onResponseBody >> body_buffer_length: " + body_buffer_length.toString()
    );

    // Retrieve the request URL
    const urlBytes = get_property("request.url");
    const url = urlBytes.byteLength === 0 ? "" : String.UTF8.decode(urlBytes);
    if (url !== "") {
      log(LogLevelValues.info, `url=${url}`);
    }

    // Retrieve the request URL
    const contentTypeBytes = get_property("request.content_type");
    const contentType =
      contentTypeBytes.byteLength === 0
        ? ""
        : String.UTF8.decode(contentTypeBytes);
    if (contentType !== "") {
      log(LogLevelValues.info, `contentType=${contentType}`);
    }

    // Retrieve the body from the HttpRequestBody buffer
    const bodyBytes = get_buffer_bytes(
      BufferTypeValues.HttpResponseBody,
      0,
      <u32>body_buffer_length
    );

    if (bodyBytes.byteLength > 0) {
      const bodyStr = String.UTF8.decode(bodyBytes);
      log(LogLevelValues.info, "onHttpResponseBody >> bodyStr: " + bodyStr);
    }
    return FilterDataStatusValues.Continue;
  }

  onLog(): void {
    log(
      LogLevelValues.info,
      "onLog >> completed (contextId): " + this.context_id.toString()
    );
  }
}

registerRootContext((context_id: u32) => {
  return new HttpBodyRoot(context_id);
}, "httpbody");
