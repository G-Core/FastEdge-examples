use fastedge::{
    body::Body,
    http::{header, Request, Response, StatusCode},
    Error,
};

#[fastedge::http]
fn main(req: Request<Body>) -> Result<Response<Body>, Error> {
    let mut body: String = "Method: ".to_string();
    body.push_str(req.method().as_str());

    body.push_str("\nURL: ");
    body.push_str(req.uri().to_string().as_str());

    body.push_str("\nClient: ");
    body.push_str(
        req.headers()
            .get("REMOTE_ADDR")
            .and_then(|h| h.to_str().ok())
            .unwrap_or(""),
    );

    body.push_str("\nHeaders:");
    for h in req.headers() {
        body.push_str("\n    ");
        body.push_str(h.0.as_str());
        body.push_str(": ");
        match h.1.to_str() {
            Err(_) => body.push_str("not a valid text"),
            Ok(a) => body.push_str(a),
        }
    }

    let rsp = Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, mime::TEXT_PLAIN_UTF_8.to_string())
        .body(Body::from(body))?;

    Ok(rsp)
}
