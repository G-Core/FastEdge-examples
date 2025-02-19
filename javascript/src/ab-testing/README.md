⏮️ Back to javascript [README.md](../../README.md)

# AB Testing

Simple AB testing application that uses cookies to provide each client with a trackable ID.

Before making the fetch to the backend, it checks for an existing usable ID, or creates a new one.

It provides some basic test cases in the format of a JSON Object.

```
const testConfig = {
  logo: [
    { variant: "hops", weight: 50 },
    { variant: "bottle", weight: 50 },
  ],
  font: [
    { variant: "exo2", weight: 40 },
    { variant: "gloria", weight: 65 },
    { variant: "standard", weight: 45 },
  ],
}
```

Using the unique ID and the weights from the testConfig it adds test specific cookies for consumption by the downstream url (backend).

These test cases and there associated `weights` ensures that returning users will always receive the same test conditions on each visit.

[Template Invoice AB Testing](../template-invoice-ab-testing/README.md) is an example of how a downstream backend could use these cookies to provide different AB Test cases.
