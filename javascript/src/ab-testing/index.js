import { getEnv } from "fastedge::env";

async function eventHandler({ request }) {
  const countryCode = request.headers.get("geoip-country-code");

  const customOrigin = getEnv(countryCode);

  const redirectOrigin = customOrigin ?? baseOrigin;

  return Response.redirect(redirectOrigin, 302);
}

addEventListener("fetch", (event) => {
  event.respondWith(eventHandler(event));
});
