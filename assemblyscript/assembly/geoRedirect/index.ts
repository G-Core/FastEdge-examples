export * from "@gcoredev/proxy-wasm-sdk-as/assembly/proxy"; // this exports the required functions for the proxy to interact with us.
import {
  Context,
  FilterHeadersStatusValues,
  get_property,
  log,
  LogLevelValues,
  registerRootContext,
  RootContext,
  send_http_response,
  set_property,
  stream_context,
} from "@gcoredev/proxy-wasm-sdk-as/assembly";
import {
  getEnvVar,
  setLogLevel,
} from "@gcoredev/proxy-wasm-sdk-as/assembly/fastedge";

const BAD_GATEWAY: u32 = 502;
const INTERNAL_SERVER_ERROR: u32 = 500;

class GeoRedirectRoot extends RootContext {
  createContext(context_id: u32): Context {
    setLogLevel(LogLevelValues.info); // Set the log level to info - for more logging reduce this to LogLevelValues.debug
    return new GeoRedirect(context_id, this);
  }
}

class GeoRedirect extends Context {
  constructor(context_id: u32, root_context: GeoRedirectRoot) {
    super(context_id, root_context);
  }

  onRequestHeaders(a: u32, end_of_stream: bool): FilterHeadersStatusValues {
    log(LogLevelValues.debug, "onRequestHeaders >> ");

    const defaultOrigin = getEnvVar("DEFAULT");

    if (!defaultOrigin) {
      send_http_response(
        INTERNAL_SERVER_ERROR,
        "internal server error",
        String.UTF8.encode("App misconfigured - DEFAULT must be set"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }

    const countryArrBuf = get_property("request.country");
    if (countryArrBuf.byteLength === 0) {
      send_http_response(
        BAD_GATEWAY,
        "bad gateway",
        String.UTF8.encode("Missing country information"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }
    const countryCode = String.UTF8.decode(countryArrBuf);
    const countrySpecificOrigin = getEnvVar(countryCode);

    log(
      LogLevelValues.debug,
      `Country code: ( ${countryCode} ): ${
        countrySpecificOrigin || "no matching origin"
      }`
    );

    const hostArrBuf = get_property("request.host");
    if (hostArrBuf.byteLength > 0) {
      const host = String.UTF8.decode(hostArrBuf);
      log(LogLevelValues.debug, `Provided Host: ${host}`);
      stream_context.headers.request.replace("Host", host);
    }

    const pathArrBuf = get_property("request.path");
    if (pathArrBuf.byteLength === 0) {
      send_http_response(
        INTERNAL_SERVER_ERROR,
        "internal server error",
        String.UTF8.encode("Internal server error - no request path"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }

    const path = String.UTF8.decode(pathArrBuf);
    const origin = countrySpecificOrigin || defaultOrigin;
    // remove trailing slashes from the origin
    const cleanedOrigin = origin.endsWith("/") ? origin.slice(0, -1) : origin;

    const requestUrl = `${cleanedOrigin}${path}`;

    log(LogLevelValues.debug, `request-url: ${requestUrl}`);

    set_property("request.url", String.UTF8.encode(requestUrl));

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
  return new GeoRedirectRoot(context_id);
}, "georedirect");
