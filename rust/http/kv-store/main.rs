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
                    format!(
                        r#"{{"Store":"{}","Action":"{}","Key":"{}","Response":"{}"}}"#,
                        escape_json(store_name),
                        escape_json(action),
                        escape_json(key),
                        escape_json(&value)
                    )
                }
                Ok(None) => {
                    format!(
                        r#"{{"Store":"{}","Action":"{}","Key":"{}","Response":"not found"}}"#,
                        escape_json(store_name),
                        escape_json(action),
                        escape_json(key)
                    )
                }
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
                    format!(
                        r#"{{"Store":"{}","Action":"{}","Match":"{}","Response":"{}"}}"#,
                        escape_json(store_name),
                        escape_json(action),
                        escape_json(pattern),
                        escape_json(&response)
                    )
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
                Some(m) => m.parse::<f64>().unwrap_or(f64::NEG_INFINITY),
                None => return json_error("Missing 'min' for zrange"),
            };
            let max = match params.get("max") {
                Some(m) => m.parse::<f64>().unwrap_or(f64::INFINITY),
                None => return json_error("Missing 'max' for zrange"),
            };

            match store.zrange_by_score(key, min, max) {
                Ok(items) => {
                    let tuples: Vec<String> = items
                        .into_iter()
                        .map(|(v, score)| {
                            format!(
                                r#"{{"Value":"{}","Score":{}}}"#,
                                escape_json(&String::from_utf8_lossy(&v)),
                                score
                            )
                        })
                        .collect();
                    let response = format!("[{}]", tuples.join(","));
                    format!(
                        r#"{{"Store":"{}","Action":"{}","Key":"{}","Min":{},"Max":{},"Response":{}}}"#,
                        escape_json(store_name),
                        escape_json(action),
                        escape_json(key),
                        min,
                        max,
                        response
                    )
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
                    let tuples: Vec<String> = items
                        .into_iter()
                        .map(|(v, score)| {
                            format!(
                                r#"{{"Value":"{}","Score":{}}}"#,
                                escape_json(&String::from_utf8_lossy(&v)),
                                score
                            )
                        })
                        .collect();
                    let response = format!("[{}]", tuples.join(","));
                    format!(
                        r#"{{"Store":"{}","Action":"{}","Key":"{}","Match":"{}","Response":{}}}"#,
                        escape_json(store_name),
                        escape_json(action),
                        escape_json(key),
                        escape_json(pattern),
                        response
                    )
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
                Ok(exists) => {
                    format!(
                        r#"{{"Store":"{}","Action":"{}","Key":"{}","Item":"{}","Response":{}}}"#,
                        escape_json(store_name),
                        escape_json(action),
                        escape_json(key),
                        escape_json(item),
                        exists
                    )
                }
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
    let err_json = format!(r#"{{"error":"{}"}}"#, escape_json(msg));
    Response::builder()
        .status(StatusCode::BAD_REQUEST)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(err_json))
}

fn escape_json(s: &str) -> String {
    s.replace('\\', "\\\\")
        .replace('"', "\\\"")
        .replace('\n', "\\n")
        .replace('\r', "\\r")
        .replace('\t', "\\t")
}
