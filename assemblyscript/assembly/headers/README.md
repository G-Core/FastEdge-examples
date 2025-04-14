⏮️ Back to AssemblyScript [README.md](../../README.md)

# Headers

This application adds, removes and modifies headers in both the `onRequestHeaders` and `onResponseHeaders` functions.

It then tests that these modifcations have been successful.

#### Known Issues

Nginx does not allow for deleting of headers in either lifecycle method. For this reason, when removing a header using:

```as
stream_context.headers.request.remove("some-header");
```

It will only set the value to an empty string.
