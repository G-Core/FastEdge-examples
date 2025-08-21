⏮️ Back to GitHub [README.md](../README.md)

# Single App Github Example

This folder contains an example GitHub workflow.

It demonstrates how you can use our [FastEdge Actions](https://github.com/gcore-github-actions/fastedge) to manage releasing a single application to FastEdge.

## Github Actions

This workflow is only a workable solution for managing a single FastEdge application within a single GitHub workflow.

Everytime this workflow runs it will build and update your application on the FastEdge API.

If this workflow is triggered when code changes have not been made, it will lead to slow builds and inefficient updates to your applications.

> [!IMPORTANT]
>
> Read
> [CI/CD Runtime](https://github.com/gcore-github-actions/fastedge/blob/main/deploy-app/DEPLOY-APP.md#cicd-runtime)
> to understand why this is necessary!!

### Workflows

You can only have **ONE** application per workflow. Each workflow should only run when updating a single application.

> [!NOTE]
>
> The "paths" field **MUST** be set correctly to avoid unnecessary builds!

```yaml
on:
  push:
    branches: ["main"]
  paths:
    - "src/first-app"
```

#### All workflow files are well commented, please read through them for a better understanding.

#### deploy-first-app.yaml

This workflow is responsible for building and deploying our first-app binary and application.

It checks out the code and builds the binary every time a change is made in the `src/first-app` directory.

From here it is able to use our [FastEdge Actions](https://github.com/gcore-github-actions/fastedge) to deploy your configuration to the FastEdge API.

#### deploy-second-app.yaml

This workflow is responsible for building and deploying our second-app binary and application.

It checks out the code and builds the binary every time a change is made in the `src/second-app` directory.

From here it is able to use our [FastEdge Actions](https://github.com/gcore-github-actions/fastedge) to deploy your configuration to the FastEdge API.

##### Using our actions

During the process of updating `applications` / `secrets` the actions will always do a comparison with what is in your workflow configuration versus what is contained within the API. Thereby only updating the API if it detects a change.

This has the advantage of making your workflows faster. i.e. we are now only updating secrets / applications that have changed. Thus speeding up time to deploy as well as not forcing the network to propogate changes that are not required.

Please keep in mind that because these single workflow actions always build a new binary, the application will always be updated as the binary will be considered as a new version.
