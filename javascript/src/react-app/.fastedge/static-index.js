// node_modules/itty-router/index.mjs
var t = ({ base: e = "", routes: t2 = [], ...r2 } = {}) => ({ __proto__: new Proxy({}, { get: (r3, o2, a2, s2) => (r4, ...c2) => t2.push([o2.toUpperCase?.(), RegExp(`^${(s2 = (e + r4).replace(/\/+(\/|$)/g, "$1")).replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`), c2, s2]) && a2 }), routes: t2, ...r2, async fetch(e2, ...o2) {
  let a2, s2, c2 = new URL(e2.url), n2 = e2.query = { __proto__: null };
  for (let [e3, t3] of c2.searchParams) n2[e3] = n2[e3] ? [].concat(n2[e3], t3) : t3;
  e: try {
    for (let t3 of r2.before || []) if (null != (a2 = await t3(e2.proxy ?? e2, ...o2))) break e;
    t: for (let [r3, n3, l, i] of t2) if ((r3 == e2.method || "ALL" == r3) && (s2 = c2.pathname.match(n3))) {
      e2.params = s2.groups || {}, e2.route = i;
      for (let t3 of l) if (null != (a2 = await t3(e2.proxy ?? e2, ...o2))) break t;
    }
  } catch (t3) {
    if (!r2.catch) throw t3;
    a2 = await r2.catch(t3, e2.proxy ?? e2, ...o2);
  }
  try {
    for (let t3 of r2.finally || []) a2 = await t3(a2, e2.proxy ?? e2, ...o2) ?? a2;
  } catch (t3) {
    if (!r2.catch) throw t3;
    a2 = await r2.catch(t3, e2.proxy ?? e2, ...o2);
  }
  return a2;
} });
var r = (e = "text/plain; charset=utf-8", t2) => (r2, o2 = {}) => {
  if (void 0 === r2 || r2 instanceof Response) return r2;
  const a2 = new Response(t2?.(r2) ?? r2, o2.url ? void 0 : o2);
  return a2.headers.set("content-type", e), a2;
};
var o = r("application/json; charset=utf-8", JSON.stringify);
var a = (e) => ({ 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 500: "Internal Server Error" })[e] || "Unknown Error";
var s = (e = 500, t2) => {
  if (e instanceof Error) {
    const { message: r2, ...o2 } = e;
    e = e.status || 500, t2 = { error: r2 || a(e), ...o2 };
  }
  return t2 = { status: e, ..."object" == typeof t2 ? t2 : { error: t2 || a(e) } }, o(t2, { status: e });
};
var c = (e) => {
  e.proxy = new Proxy(e.proxy ?? e, { get: (t2, r2) => t2[r2]?.bind?.(e) ?? t2[r2] ?? t2?.params?.[r2] });
};
var n = ({ format: e = o, missing: r2 = () => s(404), finally: a2 = [], before: n2 = [], ...l } = {}) => t({ before: [c, ...n2], catch: s, finally: [(e2, ...t2) => e2 ?? r2(...t2), e, ...a2], ...l });
var p = r("text/plain; charset=utf-8", String);
var f = r("text/html");
var u = r("image/jpeg");
var h = r("image/png");
var g = r("image/webp");
var y = (e = {}) => {
  const { origin: t2 = "*", credentials: r2 = false, allowMethods: o2 = "*", allowHeaders: a2, exposeHeaders: s2, maxAge: c2 } = e, n2 = (e2) => {
    const o3 = e2?.headers.get("origin");
    return true === t2 ? o3 : t2 instanceof RegExp ? t2.test(o3) ? o3 : void 0 : Array.isArray(t2) ? t2.includes(o3) ? o3 : void 0 : t2 instanceof Function ? t2(o3) : "*" == t2 && r2 ? o3 : t2;
  }, l = (e2, t3) => {
    for (const [r3, o3] of Object.entries(t3)) o3 && e2.headers.append(r3, o3);
    return e2;
  };
  return { corsify: (e2, t3) => e2?.headers?.get("access-control-allow-origin") || 101 == e2.status ? e2 : l(e2.clone(), { "access-control-allow-origin": n2(t3), "access-control-allow-credentials": r2 }), preflight: (e2) => {
    if ("OPTIONS" == e2.method) {
      const t3 = new Response(null, { status: 204 });
      return l(t3, { "access-control-allow-origin": n2(e2), "access-control-allow-methods": o2?.join?.(",") ?? o2, "access-control-expose-headers": s2?.join?.(",") ?? s2, "access-control-allow-headers": a2?.join?.(",") ?? a2 ?? e2.headers.get("access-control-request-headers"), "access-control-max-age": c2, "access-control-allow-credentials": r2 });
    }
  } };
};

// fastedge-server/index.ts
import {
  getStaticServer,
  createStaticAssetsCache
} from "@gcoredev/fastedge-sdk-js";
import { staticAssetManifest } from "./build/static-server-manifest.js";
import { serverConfig } from "./build-config";

// fastedge-server/middleware.ts
import { getEnv } from "fastedge::env";
function withMapApiKey(request) {
  const WEATHER_API_KEY = getEnv("WEATHER_API_KEY");
  if (!WEATHER_API_KEY) {
    return s(400, "Missing environment variable WEATHER_API_KEY");
  }
  request.mapApiKey = WEATHER_API_KEY;
}

// fastedge-server/currentWeather.ts
async function currentWeatherHandler({
  query,
  mapApiKey,
  headers
}) {
  const { lon, lat, q } = query;
  let city = q;
  if ((!lat || !lon) && !city) {
    return o({ error: "lat or lon not provided" }, { status: 400 });
  }
  if (lat === "999" && lon === "999") {
    city = headers.get("geoip-city") ?? "";
  }
  const params = `appid=${mapApiKey}&units=metric`;
  if (city) {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&${params}`
    );
  }
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&${params}`
  );
}

// fastedge-server/forecast.ts
async function forecastHandler({ query, mapApiKey }) {
  const { lon, lat } = query;
  if (!lat || !lon) {
    return o({ error: "lat or lon not provided" }, { status: 400 });
  }
  const params = `appid=${mapApiKey}&units=metric`;
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&${params}`
  );
}

// fastedge-server/index.ts
var staticAssets = createStaticAssetsCache(staticAssetManifest);
var staticServer = getStaticServer(serverConfig, staticAssets);
var { preflight } = y();
var router = n({
  before: [preflight]
  // add preflight upstream
});
router.get("/current", withMapApiKey, currentWeatherHandler);
router.get("/forecast", withMapApiKey, forecastHandler);
router.get("*", (req) => staticServer.serveRequest(req));
addEventListener(
  "fetch",
  (event) => event.respondWith(
    router.fetch(event.request).catch((error) => {
      return new Response(error.message || "Server Error", {
        status: error.status || 500
      });
    })
  )
);
