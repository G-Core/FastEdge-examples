/*
 * Sample code for a simple FastEdge application
 * This code handles incoming requests and responds with a message.
 */

async function eventHandler(event) {
  const request = event.request;
  return new Response(`You made a request to ${request.url}`);
}

addEventListener("fetch", (event) => {
  event.respondWith(eventHandler(event));
});
