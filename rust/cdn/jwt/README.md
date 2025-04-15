⏮️ Back to Rust [README.md](../../README.md)

# JWT Validation

This application performs a simple JWT token validation.

Using an invalid/expired token will refuse access:

### Expired token: (jwt.io)

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  a-string-secret-at-least-256-bits-long-thats-hard-to-break
)
header: {"alg": "HS256", "typ": "JWT"}
payload: {"sub": "1234567890", "name": "John Doe", "iat": 1516239022, "exp": 978310861} // 2001-01-01 01:01:01
```

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk3ODMxMDg2MX0.egSSDoDdAHz8Kqee7be9N168CDEwOiOej96Idm2c1yQ`

### Using a valid token will provide access:

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  a-string-secret-at-least-256-bits-long-thats-hard-to-break
)
header: {"alg": "HS256", "typ": "JWT"}
payload: {"sub": "1234567890", "name": "John Doe", "iat": 1516239022, "exp": 2051226061} // 2035-01-01 01:01:01
```

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjIwNTEyMjYwNjF9.zn_pSdcBo8T3SvNgMVYzWc5CU_MKqOlms7TpZXhPtJU`

e.g.

![secret_vars](secret-vars.png)

## Deploy

This app is provided as a Template application:

<a href="https://fastedge.preprod.world/create-template-app/44" target="_blank" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #ff4c00; text-decoration: none; border-radius: 5px;">Deploy Now</a>
