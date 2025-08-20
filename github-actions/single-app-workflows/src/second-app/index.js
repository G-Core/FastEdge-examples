import { getEnv } from "fastedge::env";
import { getSecret, getSecretEffectiveAt } from "fastedge::secret";

/*
 * Sample code demonstrating a FastEdge application accessing environment variables and secrets.
 * This code handles incoming requests, collects environment variables and secrets set on the application during deployment.
 * Responds with a "Content-Type: application/json" - set with the appropriate response headers during deployment.
 * The response includes the request URL, environment variables, and secrets.
 */

async function eventHandler(event) {
  const request = event.request;

  const responseBody = {
    url: request.url,
    env: {
      environment: getEnv("environment"),
      databaseUrl: getEnv("database-url"),
    },
    secrets: {
      apiKey: getSecret("api-key"),
      /*
       * getSecretEffectiveAt() allows for accessing secrets at different slots.
       * See https://g-core.github.io/FastEdge-sdk-js/reference/fastedgesecret/getsecreteffectiveat/
       */
      databasePassword: getSecretEffectiveAt("database-password", 10),
    },
  };

  return new Response(JSON.stringify(responseBody), {
    headers: {
      "x-custom-header": "some-test-value",
      /*
       * No need to set Content-Type header, it is injected automatically from "Response Headers" set during deployment.
       */
      // "Content-Type": "application/json"
    },
  });
}

addEventListener("fetch", (event) => {
  event.respondWith(eventHandler(event));
});
