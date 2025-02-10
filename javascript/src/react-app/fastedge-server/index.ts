import { AutoRouter, cors, IRequest } from "itty-router";
import {
  getStaticServer,
  createStaticAssetsCache,
} from "@gcoredev/fastedge-sdk-js";
import { staticAssetManifest } from "@fastedge/build/static-server-manifest.js";
import { serverConfig } from "@fastedge/build-config";

import { withMapApiKey } from "./middleware";
import { currentWeatherHandler } from "./currentWeather";
import { forecastHandler } from "./forecast";

// This is the static assets cache embedded within the binary
const staticAssets = createStaticAssetsCache(staticAssetManifest);
// FastEdge static-server able to serve static files
const staticServer = getStaticServer(serverConfig, staticAssets);

// Itty-router middleware for CORS preflight
const { preflight } = cors();
const router = AutoRouter({
  before: [preflight], // add preflight upstream
});

// BackEnd API routes - served by itty-router
router.get("/current", withMapApiKey, currentWeatherHandler);
router.get("/forecast", withMapApiKey, forecastHandler);

// This serves the static assets built in via fastedge-build for any unmatched route
router.get("*", (req: IRequest) => staticServer.serveRequest(req));

addEventListener("fetch", (event) =>
  event.respondWith(
    router.fetch(event.request).catch((error) => {
      return new Response(error.message || "Server Error", {
        status: error.status || 500,
      });
    })
  )
);
