⏮️ Back to AssemblyScript [README.md](../../README.md)

# Body

This application modifies the body in `onRequestBody` and `onResponseBody` functions.

## Application Flow

1. In `onRequestHeaders` it resets the `content-length` header. This is required as we are going to alter the body content.

2. In `onRequestBody` it reads in the body from `get_buffer_bytes` and checks if it contains the term `Client`, if so it alters the body using `set_buffer_bytes`.

3. In `onResponseHeaders` it resets the `content-length` header, sets the `transfer-encoding` header and ensures that the runtime property `response.content_type` is set according to what it has recieved in the headers.

4. In `onResponseBody` it finally reads and logs the known properties and the returns the body content.

This demonstrates the basic flow of how to manipulate the body in each life cycle hook, be mindful that altering the body requires you to manipulate the required headers before doing anything.

Also notice that we wait on the `end_of_stream` bool to be `true` before processing the body. This allows it to pass through multiple invocations buffering the content before we do any manipulation. ( you could also process this data in chunks if needed )
