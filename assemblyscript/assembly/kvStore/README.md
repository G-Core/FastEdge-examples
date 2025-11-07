⏮️ Back to AssemblyScript [README.md](../../README.md)

# KV Store

This application modifies the body in the `onResponseBody` function.

It ignores the body recieved from the origin and instead just replaces it with results from interacting with a KV Store.

**Note** This is purely to demonstate how to interact with a KV Store. It has no real world use case.

## Application Flow

1. In `onResponseHeaders` it resets the `content-length` header, sets the `transfer-encoding` header and ensures that the runtime property `response.content_type` is set to `application/json`.

2. In `onResponseBody` it demonstrates how to interact with a KV Store.

This interaction with the KV Store is powered by Query Parameters.

`store` - the name of the store you wish to open. This is the name given to a store on the application.

`action` - What you wish to perform. Options are "get", "scan", "zscan", "zrange", "bfExists". ( If no action is provided it will default to "get" )

`key` - The key you wish to access in the KV Store.

`match` - A prefix match pattern, used by "scan" and "zscan". Must include a wildcard. e.g. `foo*`

`min` / `max` - Used by zrange for defining the range of scores you wish to recieve results for.

`item` - Used by Bloom Filter exists function.
