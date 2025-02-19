export * from "@gcoredev/proxy-wasm-sdk-as/assembly/proxy"; // this exports the required functions for the proxy to interact with us.
import {
  RootContext,
  Context,
  registerRootContext,
  FilterHeadersStatusValues,
  send_http_response,
  stream_context,
} from "@gcoredev/proxy-wasm-sdk-as/assembly";

import { jwtVerify, JwtValidation } from "@gcoredev/as-jwt/assembly";

function console_log(message: string): void {
  process.stdout.write(message + "\n");
}

function getEnvVar(key: string): string {
  const hasKey = process.env.has(key);
  if (hasKey) {
    return process.env.get(key);
  }
  return "";
}

const UNAUTHORIZED: u32 = 401;
const FORBIDDEN: u32 = 403;
const INTERNAL_SERVER_ERROR: u32 = 500;

class AuthRoot extends RootContext {
  createContext(context_id: u32): Context {
    return new Auth(context_id, this);
  }
}

class Auth extends Context {
  allow: bool = false;

  constructor(context_id: u32, root_context: AuthRoot) {
    super(context_id, root_context);
  }

  onRequestHeaders(a: u32, end_of_stream: bool): FilterHeadersStatusValues {
    const secret = getEnvVar("secret");
    if (!secret) {
      send_http_response(
        INTERNAL_SERVER_ERROR,
        "internal server error",
        String.UTF8.encode("App misconfigured"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }

    const authHeader = stream_context.headers.request.get("Authorization");
    if (!authHeader) {
      send_http_response(
        UNAUTHORIZED,
        "unauthorized",
        String.UTF8.encode("No Authorization header"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }

    if (authHeader.length == 0) {
      send_http_response(
        UNAUTHORIZED,
        "unauthorized",
        String.UTF8.encode("No Authorization header"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      send_http_response(
        UNAUTHORIZED,
        "unauthorized",
        String.UTF8.encode("Token not found"),
        []
      );
      return FilterHeadersStatusValues.StopIteration;
    }

    // Decode the JWT token
    const jwtResult = jwtVerify(token, secret);
    if (jwtResult !== JwtValidation.Ok) {
      if (jwtResult === JwtValidation.Expired) {
        console_log("Token Expired");
        send_http_response(
          FORBIDDEN,
          "forbidden",
          String.UTF8.encode("Expired token"),
          []
        );
      } else {
        console_log("Bad Token");
        send_http_response(
          FORBIDDEN,
          "forbidden",
          String.UTF8.encode("Invalid token"),
          []
        );
      }
      return FilterHeadersStatusValues.StopIteration;
    }
    return FilterHeadersStatusValues.Continue;
  }
}

registerRootContext((context_id: u32) => {
  return new AuthRoot(context_id);
}, "auth");
