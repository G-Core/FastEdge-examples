# md2html

This CDN application converts Markdown document, returned by origin, to HTML.

It uses 3 CDN triggers
## on_request_headers
Used to modifying URL path if `BASE` environment variable is set. It prepends the value on `BASE` to the provided path.

## on_response_headers
Used for detecting Markdown document and changing some response headers, specifically:
- `Content-Length` is removed because at this point it response body size isn't known
- `Transfer-Encoding` is set to `Chunked` to let client to handle response body it properly without `Content-Length`
- `Content-Type` is changed to `text/html`

It also sets the flag for `on_response_body` handler to process this response.

## on_response_body
If flag is set by `on_response_headers` handler, it parses response body as Markdown document and converts it to HTML
