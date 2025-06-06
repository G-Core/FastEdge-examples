export * from "@gcoredev/proxy-wasm-sdk-as/assembly/proxy"; // this exports the required functions for the proxy to interact with us.
import {
  Context,
  FilterHeadersStatusValues,
  get_property,
  getEnvVar,
  log,
  LogLevelValues,
  registerRootContext,
  RootContext,
  send_http_response,
  set_property,
  setLogLevel,
} from "@gcoredev/proxy-wasm-sdk-as/assembly";

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

    const defaultUrl = getEnvVar("DEFAULT");

    if (!defaultUrl) {
      send_http_response(
        INTERNAL_SERVER_ERROR,
        "internal server error",
        String.UTF8.encode("App misconfigured - DEFAULT must be set"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }

    const country = get_property("request.country");
    if (country.byteLength === 0) {
      send_http_response(
        BAD_GATEWAY,
        "internal server error",
        String.UTF8.encode("Missing country information"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }
    const countryStr = String.UTF8.decode(country);
    const countrySpecificUrl = getEnvVar(countryStr);

    log(
      LogLevelValues.debug,
      `Country code: ( ${countryStr} ): ${countrySpecificUrl || "not found"}`
    );

    set_property(
      "request.url",
      String.UTF8.encode(
        countrySpecificUrl.length > 0 ? countrySpecificUrl : defaultUrl
      )
    );

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
