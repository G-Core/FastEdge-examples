import { ValueScoreTuple } from "@gcoredev/proxy-wasm-sdk-as/assembly/fastedge";

const ALL_ACTIONS = ["get", "scan", "zscan", "zrange", "bfExists"];

class RequiredParams {
  key: string;
  actions: Array<string>;

  constructor(key: string, actions: Array<string>) {
    this.key = key;
    this.actions = actions;
  }
}

function validateQueryParams(queryParams: string): Map<string, string> {
  const validParams = new Map<string, string>();

  const params = parseQueryParams(queryParams);

  // Validate 'action' parameter
  if (params.has("action")) {
    const action = params.get("action");
    if (ALL_ACTIONS.indexOf(action) == -1) {
      validParams.set(
        "error",
        `Invalid action '${action}'. Supported actions are: ${ALL_ACTIONS.join(
          ", "
        )}`
      );
      return validParams;
    }
    validParams.set("action", params.get("action"));
  } else {
    validParams.set("action", "get");
  }

  const action = validParams.get("action");

  const requiredParameters: Array<RequiredParams> = [
    new RequiredParams("store", ALL_ACTIONS),
    new RequiredParams("key", ["get", "zrange", "zscan", "bfExists"]),
    new RequiredParams("match", ["scan", "zscan"]),
    new RequiredParams("min", ["zrange"]),
    new RequiredParams("max", ["zrange"]),
    new RequiredParams("item", ["bfExists"]),
  ];

  for (let i = 0; i < requiredParameters.length; i++) {
    const requirement = requiredParameters[i];
    if (requirement.actions.includes(action)) {
      if (params.has(requirement.key) && params.get(requirement.key) != "") {
        validParams.set(requirement.key, params.get(requirement.key));
      } else {
        validParams.set(
          "error",
          `Query parameters must provide '${requirement.key}' for a '${action}' action.`
        );
        return validParams;
      }
    }
  }
  return validParams;
}

function parseQueryParams(queryString: string): Map<string, string> {
  const params = new Map<string, string>();

  if (queryString.length === 0) {
    return params; // Empty query string
  }

  // Split by & to get individual parameters
  const pairs = queryString.split("&");
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const equalIndex = pair.indexOf("=");

    if (equalIndex === -1) {
      // Parameter without value (e.g., ?flag)
      params.set(urlDecode(pair), "");
    } else {
      // Parameter with value (e.g., ?key=value)
      const key = pair.substring(0, equalIndex).trim();
      const value = pair.substring(equalIndex + 1).trim();
      params.set(urlDecode(key), urlDecode(value));
    }
  }
  return params;
}

function urlDecode(str: string): string {
  let result = "";
  let i = 0;

  while (i < str.length) {
    const char = str.charAt(i);

    if (char === "%") {
      if (i + 2 < str.length) {
        const hex = str.substring(i + 1, i + 3);
        const code = parseInt(hex, 16);
        if (!isNaN(code)) {
          result += String.fromCharCode(code as i32);
          i += 3;
          continue;
        }
      }
    } else if (char === "+") {
      result += " ";
      i++;
      continue;
    }

    result += char;
    i++;
  }

  return result;
}

function stringifyMap(map: Map<string, string>): string {
  let result = "{";
  let first = true;
  for (let i = 0; i < map.keys().length; i++) {
    const key = map.keys()[i];
    const value = map.get(key);
    if (!first) {
      result += ", ";
    }
    result += `"${key}": "${value}"`;
    first = false;
  }
  result += "}";
  return result;
}

function stringifyValueScoreTuples(arr: Array<ValueScoreTuple>): string {
  const result: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    const tuple = arr[i];
    result.push(
      `{ value: ${String.UTF8.decode(
        tuple.value
      )}, score: ${tuple.score.toString()} }`
    );
  }
  return result.join(", ");
}

export { validateQueryParams, stringifyMap, stringifyValueScoreTuples };
