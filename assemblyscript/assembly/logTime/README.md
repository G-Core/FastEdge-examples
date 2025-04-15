⏮️ Back to AssemblyScript [README.md](../../README.md)

# Log Time

This application simply logs UTC timestamps in both the `onRequestHeaders` and `onResponseHeaders` functions.

### getCurrentTime()

Internally this function uses the `get_current_time_nanoseconds` provided by the proxy-wasm ABI.

It then returns a timestamp in milliseconds, as it is a more common use case in JavaScript/AssemblyScript for initializing Date objects.
