export * from "@gcoredev/proxy-wasm-sdk-as/assembly/proxy"; // this exports the required functions for the proxy to interact with us.
import {
  Context,
  FilterDataStatusValues,
  FilterHeadersStatusValues,
  log,
  LogLevelValues,
  registerRootContext,
  RootContext,
  stream_context,
  set_property,
  set_buffer_bytes,
  BufferTypeValues,
  get_property,
} from "@gcoredev/proxy-wasm-sdk-as/assembly";
import {
  KvStore,
  setLogLevel,
} from "@gcoredev/proxy-wasm-sdk-as/assembly/fastedge";

import {
  stringifyMap,
  stringifyValueScoreTuples,
  validateQueryParams,
} from "./utils";

const INTERNAL_SERVER_ERROR: u32 = 545;
const REQUEST_QUERY = "request.query";

class HttpBodyRoot extends RootContext {
  createContext(context_id: u32): Context {
    setLogLevel(LogLevelValues.info); // Set the log level to info - for more logging reduce this to LogLevelValues.trace
    return new HttpBody(context_id, this);
  }
}

class HttpBody extends Context {
  constructor(context_id: u32, root_context: HttpBodyRoot) {
    super(context_id, root_context);
  }

  onResponseHeaders(a: u32, end_of_stream: bool): FilterHeadersStatusValues {
    log(LogLevelValues.debug, "onResponseHeaders >>");

    // Remove "content-length" header as the body size will change in onResponseBody()
    stream_context.headers.response.remove("content-length");

    // Remove any redirect headers
    stream_context.headers.response.remove("refresh");
    stream_context.headers.response.remove("location");

    // Set "transfer-encoding" to "chunked"
    stream_context.headers.response.replace("transfer-encoding", "Chunked");

    // Set content-type to application/json
    stream_context.headers.response.replace("content-type", "application/json");

    return FilterHeadersStatusValues.Continue;
  }

  onResponseBody(
    body_buffer_length: usize,
    end_of_stream: bool
  ): FilterDataStatusValues {
    if (!end_of_stream) {
      // Wait until the complete body is buffered
      return FilterDataStatusValues.StopIterationAndBuffer;
    }
    log(LogLevelValues.debug, "onResponseBody >>");

    const responseBodyMap = new Map<string, string>();

    // Retrieve the request query parameters
    const queryBytes = get_property(REQUEST_QUERY);
    const query =
      queryBytes.byteLength === 0 ? "" : String.UTF8.decode(queryBytes);
    if (query === "") {
      this.sendErrorResponse(
        "App must be called with query parameters",
        body_buffer_length
      );
      return FilterDataStatusValues.Continue;
    }

    const params = validateQueryParams(query);
    if (params.has("error")) {
      this.sendErrorResponse(params.get("error"), body_buffer_length);
      return FilterDataStatusValues.Continue;
    }

    const store = params.get("store");
    responseBodyMap.set("Store", store);
    const myStore = KvStore.open(store);
    if (myStore == null) {
      this.sendErrorResponse(
        `Failed to open KvStore: '${store}'`,
        body_buffer_length
      );
      return FilterDataStatusValues.Continue;
    }
    const action = params.get("action");
    responseBodyMap.set("Action", action);
    switch (action) {
      case "get": {
        const key = params.get("key");
        responseBodyMap.set("Key", key);
        const storeArrBuff = myStore.get(key);
        if (storeArrBuff == null) {
          responseBodyMap.set("Response", "null (Not found)");
          break;
        }
        responseBodyMap.set("Response", String.UTF8.decode(storeArrBuff));
        break;
      }
      case "scan": {
        const match = params.get("match");
        const keys = myStore.scan(match);
        responseBodyMap.set("Match", match);
        responseBodyMap.set("Response", keys.join(", "));
        break;
      }
      case "zrange": {
        const key = params.get("key");
        const min = params.get("min");
        const max = params.get("max");
        const tuples = myStore.zrangeByScore(
          key,
          parseFloat(min),
          parseFloat(max)
        );
        responseBodyMap.set("Key", key);
        responseBodyMap.set("Min", min);
        responseBodyMap.set("Max", max);
        responseBodyMap.set("Response", stringifyValueScoreTuples(tuples));
        break;
      }
      case "zscan": {
        const key = params.get("key");
        const match = params.get("match");
        const tuples = myStore.zscan(key, match);
        responseBodyMap.set("Key", key);
        responseBodyMap.set("Match", match);
        responseBodyMap.set("Response", stringifyValueScoreTuples(tuples));
        break;
      }
      case "bfExists": {
        const key = params.get("key");
        const item = params.get("item");
        const exists = myStore.bfExists(key, item);
        responseBodyMap.set("Key", key);
        responseBodyMap.set("Item", item);
        responseBodyMap.set("Response", exists ? "true" : "false");
        break;
      }
    }

    const responseBody = stringifyMap(responseBodyMap);

    set_buffer_bytes(
      BufferTypeValues.HttpResponseBody,
      0,
      <u32>body_buffer_length,
      String.UTF8.encode(responseBody)
    );
    return FilterDataStatusValues.Continue;
  }

  private sendErrorResponse(errorMsg: string, body_buffer_length: usize): void {
    set_property(
      "response.status",
      String.UTF8.encode(INTERNAL_SERVER_ERROR.toString())
    );
    log(LogLevelValues.debug, errorMsg);
    set_buffer_bytes(
      BufferTypeValues.HttpResponseBody,
      0,
      <u32>body_buffer_length,
      String.UTF8.encode('{ "error": "' + errorMsg + '" }')
    );
  }
}

registerRootContext((context_id: u32) => {
  return new HttpBodyRoot(context_id);
}, "httpBody");
