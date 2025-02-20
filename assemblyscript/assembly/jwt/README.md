⏮️ Back to AssemblyScript [README.md](../../README.md)

# JWT Validation

This application performes a simple JWT token validation.

Using an invalid/expired token will refuse access:

Expired token: (jwt.io)

```
HMACSHA512(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  my-nice-and-safe-secret
)
header: {"alg": "HS256", "typ": "JWT"}
payload: {"sub": "1234567890", "name": "John Doe", "iat": 1516239022, "exp": 978310861} // 2001-01-01 01:01:01
```

`eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk3ODMxMDg2MX0.R7mA4TjW1hUwffAQ1XjYAZQ-PUam3dsmbj0e5B7UL20BvgSWzyn67Q8LDX8ZIpHo82esA5uZDh9gavY0-Kiynw`

Using a valid token:

```
HMACSHA512(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  my-nice-and-safe-secret
)
header: {"alg": "HS256", "typ": "JWT"}
payload: {"sub": "1234567890", "name": "John Doe", "iat": 1516239022, "exp": 2051226061} // 2035-01-01 01:01:01
```

`eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjIwNTEyMjYwNjF9.4FXiNiDBdxBaEXIbLSDciCaAiAGtU78wyGt5GGA3qmxXIVvTlPfMnmt-99u6IdO422hzq0se4yDL4YqxctUB-A`

If the country code exists within the `BLACKLIST` environment variable it denies access.

e.g.

![env_vars](env-vars.png)
