use fastedge::{
    body::Body,
    http::{header, Error, Method, Request, Response, StatusCode},
    key_value::Store,
};
use std::collections::HashMap;

const ALL_ACTIONS: &[&str] = &["get", "scan", "zscan", "zrange", "bfExists"];

#[fastedge::http]
fn main(req: Request<Body>) -> Result<Response<Body>, Error> {
    if req.method() != &Method::GET {
        return Response::builder()
            .status(StatusCode::METHOD_NOT_ALLOWED)
            .header(header::ALLOW, "GET")
            .body(Body::from("This method is not allowed\n"));
    }

    let query_pairs = |q: &str| {
        q.split('&')
            .filter_map(|q| {
                let mut i = q.splitn(2, '=');
                let k = i.next()?;
                let v = i.next()?;
                Some((k, v))
            })
            .map(|(k, v)| (k.to_owned(), v.to_owned()))
            .collect::<HashMap<String, String>>()
    };
    let params: HashMap<String, String> = req.uri().query().map_or(HashMap::new(), query_pairs);

    // Validate action
    let action = params.get("action").map(|s| s.as_str()).unwrap_or("get");
    if !ALL_ACTIONS.contains(&action) {
        return json_error(&format!(
            "Invalid action '{}'. Supported actions: {}",
            action,
            ALL_ACTIONS.join(", ")
        ));
    }

    // Validate store
    let store_name = match params.get("store") {
        Some(s) => s,
        None => return json_error("Missing 'store' parameter"),
    };

    let store = match Store::open(store_name) {
        Ok(s) => s,
        Err(e) => return json_error(&format!("Failed to open store: {}", e)),
    };

    let response_json = match action {
        "get" => {
            let key = match params.get("key") {
                Some(k) => k,
                None => return json_error("Missing 'key' for get"),
            };

            match store.get(key) {
                Ok(Some(v)) => {
                    let value = String::from_utf8_lossy(&v);
                    json::object! {
                        Store: store_name.as_str(),
                        Action: action,
                        Key: key.as_str(),
                        Response: value.as_ref()
                    }
                    .dump()
                }
                Ok(None) => json::object! {
                    Store: store_name.as_str(),
                    Action: action,
                    Key: key.as_str(),
                    Response: "not found"
                }
                .dump(),
                Err(e) => return json_error(&format!("error: {}", e)),
            }
        }
        "scan" => {
            let pattern = match params.get("match") {
                Some(m) => m,
                None => return json_error("Missing 'match' for scan"),
            };

            match store.scan(pattern) {
                Ok(keys) => {
                    let response = keys.join(", ");
                    json::object! {
                        Store: store_name.as_str(),
                        Action: action,
                        Match: pattern.as_str(),
                        Response: response.as_str()
                    }
                    .dump()
                }
                Err(e) => return json_error(&format!("error: {}", e)),
            }
        }
        "zrange" => {
            let key = match params.get("key") {
                Some(k) => k,
                None => return json_error("Missing 'key' for zrange"),
            };
            let min = match params.get("min") {
                Some(m) => match m.parse::<f64>() {
                    Ok(v) => v,
                    Err(_) => return json_error("Invalid 'min' value for zrange"),
                },
                None => f64::NEG_INFINITY,
            };
            let max = match params.get("max") {
                Some(m) => match m.parse::<f64>() {
                    Ok(v) => v,
                    Err(_) => return json_error("Invalid 'max' value for zrange"),
                },
                None => f64::INFINITY,
            };

            match store.zrange_by_score(key, min, max) {
                Ok(items) => {
                    let tuples: Vec<_> = items
                        .into_iter()
                        .map(|(v, score)| {
                            json::object! {
                                Value: String::from_utf8_lossy(&v).as_ref(),
                                Score: score
                            }
                        })
                        .collect();
                    json::object! {
                        Store: store_name.as_str(),
                        Action: action,
                        Key: key.as_str(),
                        Min: min,
                        Max: max,
                        Response: tuples
                    }
                    .dump()
                }
                Err(e) => return json_error(&format!("error: {}", e)),
            }
        }
        "zscan" => {
            let key = match params.get("key") {
                Some(k) => k,
                None => return json_error("Missing 'key' for zscan"),
            };
            let pattern = match params.get("match") {
                Some(m) => m,
                None => return json_error("Missing 'match' for zscan"),
            };

            match store.zscan(key, pattern) {
                Ok(items) => {
                    let tuples: Vec<_> = items
                        .into_iter()
                        .map(|(v, score)| {
                            json::object! {
                                Value: String::from_utf8_lossy(&v).as_ref(),
                                Score: score
                            }
                        })
                        .collect();
                    json::object! {
                        Store: store_name.as_str(),
                        Action: action,
                        Key: key.as_str(),
                        Match: pattern.as_str(),
                        Response: tuples
                    }
                    .dump()
                }
                Err(e) => return json_error(&format!("error: {}", e)),
            }
        }
        "bfExists" => {
            let key = match params.get("key") {
                Some(k) => k,
                None => return json_error("Missing 'key' for bfExists"),
            };
            let item = match params.get("item") {
                Some(i) => i,
                None => return json_error("Missing 'item' for bfExists"),
            };

            match store.bf_exists(key, item) {
                Ok(exists) => json::object! {
                    Store: store_name.as_str(),
                    Action: action,
                    Key: key.as_str(),
                    Item: item.as_str(),
                    Response: exists
                }
                .dump(),
                Err(e) => return json_error(&format!("error: {}", e)),
            }
        }
        _ => return json_error("Unknown action"),
    };

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(response_json))
}

fn json_error(msg: &str) -> Result<Response<Body>, Error> {
    let err_json = json::object! {
        error: msg
    }
    .dump();
    Response::builder()
        .status(StatusCode::BAD_REQUEST)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(err_json))
}
